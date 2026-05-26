require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,          // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    groqKeySet: !!(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_actual')),
    jwtSecretSet: !!process.env.JWT_SECRET,
    mongoUri: process.env.MONGO_URI ? 'set' : 'not set',
  });
});

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/market', require('./routes/market'));

// ── MongoDB Connection ──────────────────────────────────────────────────────
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set — database will not work!');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// ── Startup Checks ──────────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('❌  JWT_SECRET is not set in .env — authentication will fail!');
}
if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_actual')) {
  console.error('❌  GROQ_API_KEY is not set in .env — AI generation will fail!');
} else {
  console.log('✅  Groq API key loaded.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
