import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      throw new Error('MONGODB_URI is not defined');
    }
    
    // Set connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Log connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected - attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });
    
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Attempting to connect to MongoDB...');
    });
    
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MONGODB_URI in .env file');
    console.error('Make sure:');
    console.error('  1. MongoDB is running (if using local MongoDB)');
    console.error('  2. Your IP is whitelisted (if using MongoDB Atlas)');
    console.error('  3. Your credentials are correct');
    console.error('  4. Your internet connection is stable');
    throw error; // Re-throw instead of exiting so server can handle it
  }
};

export default connectDB;

