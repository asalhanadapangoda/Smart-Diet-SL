# How to Check Database Connection

This guide shows you multiple ways to verify that your MongoDB database is connected properly.

## Method 1: Check Server Console Logs

When you start your server, look for these messages in the terminal:

### ✅ Successful Connection:
```
✅ MongoDB Connected Successfully!
   Host: cluster0.xxxxx.mongodb.net
   Database: test
   Ready State: Connected
Server running in development mode on port 5000
```

### ❌ Connection Failed:
```
❌ MongoDB Connection Error: <error message>
Please check your MONGODB_URI in .env file
Make sure:
  1. MongoDB is running (if using local MongoDB)
  2. Your IP is whitelisted (if using MongoDB Atlas)
  3. Your credentials are correct
```

## Method 2: Use the Database Health Check Endpoint

I've added a dedicated endpoint to check database status.

### Check Database Connection:
```bash
# Using curl
curl http://localhost:5000/api/health/db

# Or open in browser
http://localhost:5000/api/health/db
```

### ✅ Successful Response (200):
```json
{
  "status": "connected",
  "message": "Database is connected successfully",
  "database": "test",
  "host": "cluster0.xxxxx.mongodb.net",
  "readyState": "connected",
  "collections": ["dietplans", "users", "products", "orders"],
  "timestamp": "2025-11-15T12:00:00.000Z"
}
```

### ❌ Failed Response (503):
```json
{
  "status": "disconnected",
  "message": "Database is not connected",
  "readyState": "disconnected",
  "timestamp": "2025-11-15T12:00:00.000Z"
}
```

## Method 3: Check Server Health Endpoint

Check if the server is running (doesn't check DB):
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "message": "Server is running!"
}
```

## Method 4: Test with a Simple API Call

Try fetching diet plans (or any collection):
```bash
curl http://localhost:5000/api/diet-plans
```

If the database is connected, you'll get data or an empty array.
If disconnected, you'll get an error.

## Method 5: Check MongoDB Connection State Programmatically

The connection state can be:
- `0` = disconnected
- `1` = connected
- `2` = connecting
- `3` = disconnecting

## Common Issues and Solutions

### Issue 1: "MONGODB_URI is not defined"
**Solution:** Make sure you have a `.env` file in the `Server` directory with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

### Issue 2: "Connection timeout"
**Solutions:**
- Check if MongoDB Atlas cluster is running
- Verify your IP is whitelisted (use `0.0.0.0/0` for development)
- Check your internet connection

### Issue 3: "Authentication failed"
**Solutions:**
- Verify username and password in connection string
- Make sure database user has proper permissions
- Check if password has special characters (may need URL encoding)

### Issue 4: "Server running but DB operations fail"
**Solution:** Check the `/api/health/db` endpoint to see the actual connection status

## Quick Test Script

You can also create a simple test file to check connection:

```javascript
// test-db.js (in Server directory)
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run it with:
```bash
cd Server
node test-db.js
```

## Monitoring Connection Events

The database connection now logs these events automatically:
- ✅ Connection successful
- ❌ Connection errors
- ⚠️ Disconnection warnings
- ✅ Reconnection success

Watch your server console for these messages.

