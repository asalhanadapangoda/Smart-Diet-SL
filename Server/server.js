import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/database.js';

// Load environment variables FIRST
dotenv.config();

// Add process error handlers to catch unhandled errors
process.on('uncaughtException', (error) => {
  console.error('\n❌ UNCAUGHT EXCEPTION - Server is crashing!');
  console.error('==========================================');
  console.error('Error Message:', error.message);
  console.error('Error Name:', error.name);
  console.error('\nFull Error:');
  console.error(error);
  console.error('\nStack Trace:');
  console.error(error.stack);
  console.error('==========================================\n');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ UNHANDLED REJECTION - Server is crashing!');
  console.error('==========================================');
  console.error('Reason:', reason);
  console.error('Promise:', promise);
  if (reason instanceof Error) {
    console.error('Error Message:', reason.message);
    console.error('Stack:', reason.stack);
  }
  console.error('==========================================\n');
  process.exit(1);
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';
import dietRoutes from './routes/diet.js';
import uploadRoutes from './routes/uploadRoutes.js';
import traditionalFoodRoutes from './routes/traditionalFoodRoutes.js';
import dailyTipRoutes from './routes/dailyTipRoutes.js';
import mealLogRoutes from './routes/mealLogRoutes.js';
import sriLankanPlateRoutes from './routes/sriLankanPlateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';

const app = express();

// Connect to database (with error handling and retry logic)
let dbConnected = false;

const initializeDB = async () => {
  try {
    await connectDB();
    dbConnected = true;
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('⚠️  Server will continue but database operations will fail');
    console.error('💡 The server will attempt to reconnect automatically');
    dbConnected = false;
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying database connection...');
      initializeDB();
    }, 5000);
  }
};

// Start database connection
initializeDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/traditional-foods', traditionalFoodRoutes);
app.use('/api/daily-tips', dailyTipRoutes);
app.use('/api/meal-logs', mealLogRoutes);
app.use('/api/sri-lankan-plates', sriLankanPlateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/farmer', farmerRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Diet SL API is running',
    health: '/api/health',
  });
});

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

// Start server with error handling
try {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  console.error('Error details:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
