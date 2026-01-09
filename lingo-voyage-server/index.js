import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Topic from './models/Topic.js';
import Word from './models/Word.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from './middleware/auth.js';
import { saveTopic } from './services/saveTopic.js';

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const __dirname = path.resolve();
const envPath = path.join(__dirname, '.env');
const examplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
    console.log('⚠️ No .env file found. Creating one from .env.example...');

    if (fs.existsSync(examplePath)) {
        let content = fs.readFileSync(examplePath, 'utf8');

        // Generate secrets
        const randomSecret = crypto.randomBytes(32).toString('hex');         // JWT secret (hex)
        const fieldEncKeyB64 = crypto.randomBytes(32).toString('base64');    // 32-byte key, base64

        // Replace placeholders
        content = content.replace('YOUR_SECRET_HERE', randomSecret);
        content = content.replace('YOUR_FIELD_ENC_KEY_HERE', fieldEncKeyB64);

        fs.writeFileSync(envPath, content);
        console.log('✅ .env file created successfully with unique JWT_SECRET and FIELD_ENC_KEY.');
        dotenv.config();
    } else {
        console.error('❌ Error: .env.example missing! Cannot auto-create .env.');
    }
}


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.send("API is working!"));


const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
    })
    .catch(err => console.error(err));

app.post('/api/register', async (req, res) => {
    try {
        const { username, password, mainLanguage, targetLanguage, aiApiKey } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "Username and password are required" });
        }
        if (!mainLanguage || !targetLanguage) {
          return res.status(400).json({ error: "Main and target languages are required" });
        }
        if (!aiApiKey) {
          return res.status(400).json({ error: "AI API key is required" });
        }
        const user = new User({ username, password, mainLanguage, targetLanguage, aiApiKey });
        await user.save();
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // res.status(201).json({ token });
        // 1. Set the cookie in the header
        res.cookie('token', token, {
          httpOnly: true,     // Protects against XSS (JavaScript can't read it)
          secure: false,      // Set to 'true' later when you use HTTPS
          sameSite: 'lax',    // Standard security for local development
          maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
        });

        // 2. Send the JSON response (without the token inside it)
        res.status(201).json({
          message: "User registered and logged in!",
          user: { id: user._id, username: user.username }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Username already exists" });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create the Token (the 'stamp') using your auto-generated secret
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // res.json({ token });
        res.cookie('token', token, {
          httpOnly: true,    // JavaScript can't touch this! (Security)
          secure: false,      // Set to true in production (HTTPS)
          sameSite: 'lax',   // Helps prevent CSRF attacks
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({
          message: "Logged in!",
          user: { id: user._id, username: user.username } // Return user data here
        });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.post('/api/topics', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // adjust if your middleware sets a different field

    // Explicitly select the encrypted key (hidden by default) and languages
    const user = await User.findById(userId).select('+aiApiKeyCiphertext');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const apiKey = user.getAiApiKey();
    if (!apiKey) {
      return res.status(400).json({
        error: 'API key is required. Please set your Gemini API key in your profile.'
      });
    }

    const data = req.body; // { topic, entryMode, comment, words }
    const result = await saveTopic(
      data,
      userId,
      { mainLanguage: user.mainLanguage, targetLanguage: user.targetLanguage },
      apiKey
    );

    res.json(result);
  } catch (err) {
    // Keep errors generic; never leak secrets
    res.status(500).json({ error: err.message || 'Failed to create topic' });
  }
});


app.get('/api/topics', verifyToken, async (req, res) => {
  try {
    const userTopics = await Topic.find({ owner: req.user.id });
    res.json(userTopics);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch topics" });
  }
});
app.get('/api/topics/:topicId/words', verifyToken, async (req, res) => {
  try {
    const { topicId } = req.params;

    console.log(topicId);
    console.log(req.user.id);

    const topic = await Topic.findOne({ _id: topicId, owner: req.user.id });
    console.log(topic);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const words = await Word.find({ topic: topicId });
    console.log(words);
    res.json(words);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch words" });
  }
});
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    // Return 200 instead of 401
    return res.json({ authenticated: false });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, user: verified });
  } catch (err) {
    // Even if the token is invalid/expired, return 200
    res.json({ authenticated: false });
  }
});
app.post('/api/logout', (req, res) => {
  res.clearCookie('token').json({ message: "Logged out" });
});
