import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRoutes } from './routes/auth';
import { messageRoutes } from './routes/messages';
import { scheduledRoutes } from './routes/scheduled';
import { initDatabase } from './database/init';
import { startScheduler } from './services/scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../../frontend/build');
  app.use(express.static(frontendBuildPath));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Slack Connect Backend is running!' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/scheduled', scheduledRoutes);

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const frontendBuildPath = path.join(__dirname, '../../frontend/build');
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Slack Connect Backend is running!' });
  });
}

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    startScheduler();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
