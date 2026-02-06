# Quick Fix for Network Error

## Current Error
```
404 Not Found
smart-diet-sl-1.onrender.com/daily-tips/today
smart-diet-sl-1.onrender.com/auth/login
```

## Root Cause
Your `VITE_API_URL` environment variable is missing the `/api` suffix!

**Wrong**: `https://smart-diet-sl-1.onrender.com`  
**Correct**: `https://smart-diet-sl-1.onrender.com/api`

## Immediate Solution

### Step 1: Fix Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your project: `smart-diet-sl`
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL` and click **Edit**
5. **IMPORTANT**: Make sure it ends with `/api`
   - ✅ **Correct**: `https://smart-diet-sl-1.onrender.com/api`
   - ❌ **Wrong**: `https://smart-diet-sl-1.onrender.com`
6. Click **Save**
7. Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**

### Step 2: Verify the URL Format

Your `VITE_API_URL` should be:
```
https://smart-diet-sl-1.onrender.com/api
```

**Note**: The `/api` at the end is **required** because all server routes are prefixed with `/api`.

### Step 3: Test After Redeploy

After redeploying, test these URLs in your browser:
- ✅ `https://smart-diet-sl-1.onrender.com/api/health` (should work)
- ✅ `https://smart-diet-sl-1.onrender.com/api/daily-tips/today` (should work)
- ❌ `https://smart-diet-sl-1.onrender.com/daily-tips/today` (will 404 - missing /api)

### Step 3: Deploy Backend (If Not Done)

**Quick Option - Render (Free):**
1. Go to https://render.com
2. Sign up → New Web Service
3. Connect GitHub → Select `Server` folder
4. Add environment variables (see DEPLOYMENT_GUIDE.md)
5. Deploy
6. Copy the URL and use it in Vercel's `VITE_API_URL`

## After Fix

Once `VITE_API_URL` is set correctly:
- ✅ Network errors will stop
- ✅ Daily tips will load from API
- ✅ All API features will work

## Note

The error is already handled gracefully - the app shows a default tip when the API fails. Setting `VITE_API_URL` will make it use the real API instead.

