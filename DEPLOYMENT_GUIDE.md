# Deployment Guide - Smart Diet SL

This guide explains how to deploy the Smart Diet SL application to production.

## Overview

The application consists of:
- **Frontend**: React app (deployed on Vercel)
- **Backend**: Node.js/Express API (needs to be deployed separately)

---

## Frontend Deployment (Vercel)

### Current Status
Your frontend is already deployed on Vercel at: `https://smart-diet-sl.vercel.app`

### Issue: API Connection Error

**Problem**: The frontend is trying to connect to `localhost:5000`, which doesn't work in production.

**Error**: `ERR_CONNECTION_REFUSED` or `ERR_NETWORK`

### Solution: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project: `smart-diet-sl`

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Environment Variable**
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://your-api-domain.com/api`)
   - **Environment**: Select all (Production, Preview, Development)

4. **Redeploy**
   - After adding the variable, go to **Deployments**
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### Example Environment Variables for Vercel

```
VITE_API_URL=https://your-backend-api.herokuapp.com/api
```

Or if using a custom domain:
```
VITE_API_URL=https://api.smartdiet.lk/api
```

---

## Backend Deployment Options

You need to deploy your backend server. Here are the options:

### Option 1: Render (Recommended - Free Tier Available)

1. **Create Account**
   - Go to https://render.com
   - Sign up for free account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Server` folder as root directory

3. **Configure Build Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Add Environment Variables**
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=https://smart-diet-sl.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GROQ_API_KEY=your_groq_key (optional)
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://smart-diet-sl.onrender.com`)

6. **Update Vercel Environment Variable**
   - Go back to Vercel
   - Update `VITE_API_URL` to: `https://smart-diet-sl.onrender.com/api`

### Option 2: Railway

1. **Create Account**
   - Go to https://railway.app
   - Sign up for free account

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `Server`

3. **Add Environment Variables**
   - Same as Render (see above)

4. **Deploy**
   - Railway will auto-detect Node.js
   - Add environment variables
   - Deploy automatically

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd Server
   heroku create smart-diet-sl-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   heroku config:set CLIENT_URL=https://smart-diet-sl.vercel.app
   # ... add all other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create Account**
   - Go to https://www.digitalocean.com
   - Sign up

2. **Create App**
   - Go to App Platform
   - Create new app from GitHub
   - Select `Server` folder

3. **Configure**
   - Add environment variables
   - Deploy

---

## Database Setup (MongoDB Atlas)

### Required for Production

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your server

3. **Create Database User**
   - Username: `smartdietuser`
   - Password: Generate strong password
   - Save credentials!

4. **Whitelist IP Address**
   - Network Access → Add IP Address
   - For development: `0.0.0.0/0` (allows all)
   - For production: Add your server's IP

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://smartdietuser:password@cluster0.xxxxx.mongodb.net/smart-diet-sl?retryWrites=true&w=majority`

6. **Add to Backend Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://smartdietuser:password@cluster0.xxxxx.mongodb.net/smart-diet-sl
   ```

---

## Complete Deployment Checklist

### Backend Deployment
- [ ] Choose hosting platform (Render/Railway/Heroku)
- [ ] Deploy backend server
- [ ] Set all environment variables
- [ ] Test backend health endpoint: `https://your-api.com/api/health`
- [ ] Test database connection: `https://your-api.com/api/health/db`

### Frontend Deployment
- [ ] Frontend already deployed on Vercel ✅
- [ ] Add `VITE_API_URL` environment variable in Vercel
- [ ] Set value to your backend API URL
- [ ] Redeploy frontend

### Database
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP addresses
- [ ] Get connection string
- [ ] Add to backend environment variables

### Testing
- [ ] Test frontend loads correctly
- [ ] Test API connection (check Network tab)
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test daily tips load
- [ ] Test chatbot (if configured)

---

## Environment Variables Summary

### Backend (Server) Environment Variables
```env
PORT=10000  # Or whatever port your hosting provides
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-diet-sl
JWT_SECRET=your_strong_random_secret_key_at_least_32_chars
JWT_EXPIRE=7d
CLIENT_URL=https://smart-diet-sl.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key  # Optional for chatbot
```

### Frontend (Vercel) Environment Variables
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## Troubleshooting

### Error: `ERR_CONNECTION_REFUSED`
**Cause**: Frontend trying to connect to `localhost:5000`  
**Solution**: Set `VITE_API_URL` in Vercel environment variables

### Error: `CORS Error`
**Cause**: Backend `CLIENT_URL` doesn't match frontend URL  
**Solution**: Update `CLIENT_URL` in backend to match your Vercel URL

### Error: `MongoDB Connection Failed`
**Cause**: Wrong connection string or IP not whitelisted  
**Solution**: 
- Check MongoDB Atlas connection string
- Whitelist `0.0.0.0/0` in Network Access (for testing)
- Verify password in connection string

### Error: `JWT_SECRET is not defined`
**Cause**: Missing environment variable  
**Solution**: Add `JWT_SECRET` to backend environment variables

### Daily Tips Not Loading
**Cause**: API connection issue  
**Solution**: 
- Check `VITE_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for errors
- The app will show a default tip if API fails (this is expected behavior)

---

## Quick Fix for Current Error

**To fix the current error immediately:**

1. **If you have a backend deployed:**
   - Go to Vercel → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Redeploy

2. **If you don't have a backend deployed yet:**
   - The app will show default tips (this is working as designed)
   - Deploy backend first, then update `VITE_API_URL`
   - Or use the app with limited functionality until backend is deployed

---

## Production URLs Example

After deployment, your URLs should look like:

- **Frontend**: `https://smart-diet-sl.vercel.app`
- **Backend**: `https://smart-diet-sl-api.onrender.com`
- **API Base**: `https://smart-diet-sl-api.onrender.com/api`

Then in Vercel, set:
```
VITE_API_URL=https://smart-diet-sl-api.onrender.com/api
```

---

## Security Notes

1. **Never commit `.env` files** to Git
2. **Use strong JWT_SECRET** (at least 32 characters)
3. **Use HTTPS** in production (most platforms provide this automatically)
4. **Limit MongoDB IP whitelist** to your server IPs in production
5. **Rotate secrets** regularly
6. **Monitor API usage** to prevent abuse

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check backend logs in your hosting platform
3. Verify all environment variables are set
4. Test API endpoints directly (e.g., `https://your-api.com/api/health`)

---

*Last updated: 2024*

