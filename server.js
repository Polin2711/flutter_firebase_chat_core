const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const rankRoutes = require('./routes/ranks');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ranks', rankRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Join chat room
  socket.on('join-chat', (data) => {
    socket.join('general-chat');
    console.log(`Usuario ${data.username} se unió al chat general`);
  });

  // Handle new messages
  socket.on('send-message', (data) => {
    // Broadcast message to all users in the chat room
    io.to('general-chat').emit('new-message', {
      id: Date.now(),
      username: data.username,
      rank: data.rank,
      rankIcon: data.rankIcon,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle user typing
  socket.on('typing', (data) => {
    socket.broadcast.to('general-chat').emit('user-typing', {
      username: data.username,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/las-empoderas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});