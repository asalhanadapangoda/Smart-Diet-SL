# Vercel Setup Guide - Fix "Route not found" Error

## Current Error
```
{"message":"Route not found"}
```

This error means Vercel is trying to run your **backend server** instead of your **frontend React app**.

## Quick Fix

### Step 1: Set Root Directory in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your project: `smart-diet-sl`
3. Go to **Settings** → **General**
4. Find **Root Directory** section
5. **Set it to**: `Client`
6. Click **Save**

### Step 2: Update Build Settings

In the same **Settings** → **General** page:

1. Scroll to **Build & Development Settings**
2. Configure:
   - **Framework Preset**: `Vite` (or "Other" if Vite not available)
   - **Root Directory**: `Client` ✅
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Save**

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**

## What This Does

- **Before**: Vercel was trying to deploy from root or Server folder → Backend code runs → Shows "Route not found"
- **After**: Vercel deploys from Client folder → Frontend React app runs → All routes work ✅

## Verification

After redeploying, your Vercel URL should:
- ✅ Show your React app homepage (not JSON error)
- ✅ All routes work: `/login`, `/products`, `/cart`, etc.
- ✅ No more "Route not found" error

## Additional Configuration

I've created `Client/vercel.json` which handles:
- SPA routing (all routes serve `index.html`)
- Asset caching for better performance

This file is already in your repository and will be used automatically.

## If Still Not Working

1. **Check Root Directory**: Must be exactly `Client` (case-sensitive)
2. **Check Build Logs**: Go to Deployments → Click on deployment → Check build logs for errors
3. **Clear Cache**: In Vercel, go to Settings → Clear build cache → Redeploy
4. **Verify Build**: Make sure `Client/package.json` has `build` script

## Summary

**The fix is simple**: Set Root Directory to `Client` in Vercel settings, then redeploy.

---

**Note**: Your backend should be deployed separately (e.g., on Render, Railway, or Heroku). Vercel should only deploy the frontend (Client folder).

