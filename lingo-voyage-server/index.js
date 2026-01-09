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

        // Find a placeholder like "YOUR_SECRET_HERE" and replace it with a real random string
        const randomSecret = crypto.randomBytes(32).toString('hex');
        content = content.replace('YOUR_SECRET_HERE', randomSecret);

        fs.writeFileSync(envPath, content);
        console.log('✅ .env file created successfully with a unique JWT_SECRET.');
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
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "Username and password are required" });
        }
        const user = new User({ username, password });
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
      // Get the user's API key
      const user = await User.findById(req.user.id);
      if (!user || !user.aiApiKey) {
        return res.status(400).json({
          error: "Gemini API key not found. Please set your API key in your profile settings."
        });
      }

      // Let the service handle everything
      const result = await saveTopic(
        req.body,
        req.user.id,
        { mainLanguage: user.mainLanguage, targetLanguage: user.targetLanguage },
        user.aiApiKey
      );

      res.status(201).json(result);
    } catch (err) {
      console.error('Error creating topic:', err);
      res.status(500).json({ error: err.message || "Failed to create topic" });
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
