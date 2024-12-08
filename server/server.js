import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import protect from './middleware/authMiddleware.js';
import * as userController from './controllers/userController.js';
import * as chatController from './controllers/chatController.js';
import * as messageController from './controllers/messageController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB().catch(console.error);

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes
app.post('/api/users/register', userController.registerUser);
app.post('/api/users/login', userController.loginUser);

// Protected routes
app.use('/api/chats', protect);
app.post('/api/chats', chatController.createChat);
app.get('/api/chats', chatController.getUserChats);
app.get('/api/chats/:chatId/messages', messageController.getChatMessages);
app.post('/api/chats/:chatId/messages', messageController.sendMessage);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join chat', (chatId) => {
    socket.join(chatId);
    console.log('User joined chat:', chatId);
  });

  socket.on('new message', (message) => {
    const chat = message.chatId;
    socket.to(chat).emit('message received', message);
  });

  socket.on('typing', (chatId) => {
    socket.to(chatId).emit('typing', chatId);
  });

  socket.on('stop typing', (chatId) => {
    socket.to(chatId).emit('stop typing', chatId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});