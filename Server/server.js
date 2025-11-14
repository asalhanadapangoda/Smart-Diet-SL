import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to database (with error handling)
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
  console.error('Server will continue but database operations will fail');
  console.error('Please check your MONGODB_URI in .env file');
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Database health check route
app.get('/api/health/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    if (dbState === 1) {
      const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name;
      const host = mongoose.connection.host;
      const collections = await mongoose.connection.db?.listCollections().toArray();
      
      res.json({
        status: 'connected',
        message: 'Database is connected successfully',
        database: dbName,
        host: host,
        readyState: states[dbState],
        collections: collections?.map(c => c.name) || [],
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'disconnected',
        message: 'Database is not connected',
        readyState: states[dbState] || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Failed to check database connection',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

