import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { encrypt, decrypt } from '../services/crypto.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  mainLanguage: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  aiApiKeyCiphertext:
  {
    type: String,
    select: false
  },
  aiApiKeyLast4: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Accept plaintext via virtual, store encrypted + last4
userSchema.virtual('aiApiKey')
  .set(function(v) {
    if (typeof v !== 'string' || v.length === 0) return;
    this.aiApiKeyLast4 = v.slice(-4);
    this.aiApiKeyCiphertext = encrypt(v);
  });

// Instance method to retrieve the plaintext when needed
userSchema.methods.getAiApiKey = function() {
  if (!this.aiApiKeyCiphertext) return null;
  return decrypt(this.aiApiKeyCiphertext);
};

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);
