# Troubleshooting Guide

## 500 Internal Server Error

If you're getting a 500 error, here are the most common causes and solutions:

### 1. MongoDB Connection Issue

**Problem:** MongoDB is not running or connection string is incorrect.

**Solution:**
- Check if MongoDB is installed and running
- For local MongoDB: Make sure MongoDB service is running
- For MongoDB Atlas: Verify your connection string in `.env` file
- Test connection: `mongodb://localhost:27017/smart-diet-sl`

**Check your `.env` file in `Server` folder:**
```env
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl
```

### 2. Missing Environment Variables

**Problem:** Required environment variables are not set.

**Solution:**
- Make sure `.env` file exists in `Server` folder
- Check that all required variables are set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT` (optional, defaults to 5000)

### 3. Port Already in Use

**Problem:** Port 5000 is already being used by another application.

**Solution:**
- Change `PORT` in `.env` file to a different port (e.g., 5001)
- Or stop the application using port 5000

### 4. Missing Dependencies

**Problem:** Node modules are not installed.

**Solution:**
```bash
cd Server
npm install
```

### 5. Cloudinary Configuration (Optional)

**Problem:** Cloudinary credentials are missing (this won't cause 500 error, but image uploads won't work).

**Solution:**
- Image uploads will work with memory storage even without Cloudinary
- To enable Cloudinary, add credentials to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Quick Fixes

### Restart the Server

1. Stop the server (Ctrl+C in terminal)
2. Make sure `.env` file exists with correct values
3. Restart: `npm run dev`

### Check Server Logs

Look at the terminal where the server is running for error messages. Common errors:
- `MongoDB Connection Error` - MongoDB issue
- `MONGODB_URI is not defined` - Missing .env file
- `Port already in use` - Port conflict

### Test Server Health

Open in browser: http://localhost:5000/api/health

Should return: `{"message":"Server is running!"}`

If this works, the server is running correctly and the issue is with a specific route.

## Still Having Issues?

1. Check the terminal output for specific error messages
2. Verify `.env` file exists and has correct values
3. Make sure MongoDB is running (if using local MongoDB)
4. Try restarting both server and client


