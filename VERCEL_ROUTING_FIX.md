# Fix for "Route not found" on Vercel

## Problem
When accessing your Vercel URL, you see:
```json
{"message":"Route not found"}
```

**This error is coming from your BACKEND server**, which means:
- Vercel is trying to deploy/run the Server code instead of the Client code
- The Root Directory in Vercel is set incorrectly
- Vercel needs to deploy the `Client` folder, not the root or `Server` folder

## Solution

### Option 1: If Vercel is Deploying from Root Directory

Create `vercel.json` in the **root** of your project:

```json
{
  "buildCommand": "cd Client && npm install && npm run build",
  "outputDirectory": "Client/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 2: If Vercel is Deploying from Client Directory

Create `vercel.json` in the **Client** directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Steps to Fix

### Step 1: Fix Vercel Root Directory (CRITICAL)

1. Go to https://vercel.com/dashboard
2. Click on your project: `smart-diet-sl`
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. **IMPORTANT**: Set it to `Client` (not root, not Server)
6. Click **Save**

### Step 2: Update Build Settings

1. Still in **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Set:
   - **Framework Preset**: Vite (or leave as "Other")
   - **Root Directory**: `Client` ✅
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Verify vercel.json

Make sure `Client/vercel.json` exists (I've created it for you). It should contain:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **⋯** on latest deployment
3. Click **Redeploy**

## What the Configuration Does

The `rewrites` rule tells Vercel:
- For ANY route (`(.*)`), serve `/index.html`
- This allows React Router to handle routing on the client side
- All routes will load the React app, which then handles routing

## Verification

After redeploying:
- ✅ `https://your-app.vercel.app/` → Should show homepage
- ✅ `https://your-app.vercel.app/login` → Should show login page
- ✅ `https://your-app.vercel.app/products` → Should show products page
- ✅ `https://your-app.vercel.app/any-route` → Should load React app (not 404)

## Alternative: Manual Vercel Configuration

If you prefer to configure in Vercel dashboard:

1. Go to **Settings** → **General**
2. Under **Build & Development Settings**:
   - **Root Directory**: `Client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Go to **Settings** → **Functions** (if available)
4. Add rewrite rule manually

## Troubleshooting

### Still seeing 404?
- Make sure `vercel.json` is in the correct location
- Check that Root Directory matches where `vercel.json` is located
- Verify build is successful (check build logs)
- Clear Vercel cache and redeploy

### Build fails?
- Check that `Client/package.json` has `build` script
- Verify all dependencies are installed
- Check build logs in Vercel dashboard

---

**Note**: I've created both `vercel.json` files for you. Use the one that matches your Vercel project configuration.

