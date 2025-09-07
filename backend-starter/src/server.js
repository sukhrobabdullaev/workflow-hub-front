const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const workspaceRoutes = require('./routes/workspace');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');
const subscriptionRoutes = require('./routes/subscription');

const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');
const websocketHandler = require('./websocket/handler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/workspaces', authMiddleware, workspaceRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// WebSocket handling
websocketHandler(io);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested endpoint does not exist',
    },
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 WorkflowHub API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
