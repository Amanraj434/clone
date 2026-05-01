const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const matchRoutes   = require('./routes/matches');
const chatRoutes    = require('./routes/chat');
const Message       = require('./models/Message');
const authMiddleware = require('./middleware/authMiddleware');

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl/Postman) or from allowed list
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
};

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: corsOptions });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/matches',  matchRoutes);
app.use('/api/messages', chatRoutes);

app.get('/', (req, res) => res.json({ message: 'BMSIT Connect API running ✅' }));

// ── Socket.io – Real-time Chat ────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join a match room
  socket.on('joinRoom', (matchId) => {
    socket.join(matchId);
    console.log(`Socket ${socket.id} joined room: ${matchId}`);
  });

  // Receive & broadcast a message
  socket.on('sendMessage', async ({ matchId, senderId, text }) => {
    try {
      const message = new Message({ matchId, senderId, text });
      await message.save();
      io.to(matchId).emit('receiveMessage', message);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ matchId, userId }) => {
    socket.to(matchId).emit('typing', { userId });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ── Database & Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
