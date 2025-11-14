# Environment Variables Guide

This document explains what should be included in your `.env` files for the Smart Diet SL application.

## Server `.env` File

Location: `Smart-Diet-SL/Server/.env`

### Required Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection (REQUIRED)
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-diet-sl

# JWT Secret (REQUIRED - Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Optional Variables

```env
# Cloudinary Configuration (Optional - for Image Uploads)
# Get these from https://cloudinary.com/dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Generative AI (Optional - for AI Diet Plans)
# Get this from https://aistudio.google.com/apikey
GOOGLE_API_KEY=your_google_api_key
```

### Complete Server `.env` Example

```env
# ============================================
# Server Configuration
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# MongoDB Connection (REQUIRED)
# ============================================
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl

# For MongoDB Atlas (uncomment and replace):
# MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/smart-diet-sl?retryWrites=true&w=majority

# ============================================
# JWT Authentication (REQUIRED)
# ============================================
# IMPORTANT: Change this to a strong random string!
# Generate a random string: openssl rand -base64 32
JWT_SECRET=my_super_secret_jwt_key_1234567890abcdefghijklmnopqrstuvwxyz
JWT_EXPIRE=7d

# ============================================
# Cloudinary (Optional - for image uploads)
# ============================================
# Sign up at https://cloudinary.com to get these
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# ============================================
# CORS Configuration
# ============================================
CLIENT_URL=http://localhost:5173
```

---

## Client `.env` File

Location: `Smart-Diet-SL/Client/.env`

### Required Variables

```env
# API URL
VITE_API_URL=http://localhost:5000/api
```

### Complete Client `.env` Example

```env
# ============================================
# API Configuration
# ============================================
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# For production, change to:
# VITE_API_URL=https://your-api-domain.com/api
```

---

## Variable Explanations

### Server Variables

#### `PORT` (Required)
- **Description**: Port number where the server will run
- **Default**: 5000
- **Example**: `PORT=5000`
- **Note**: Make sure this port is not already in use

#### `NODE_ENV` (Required)
- **Description**: Environment mode (development, production, test)
- **Default**: development
- **Example**: `NODE_ENV=development`
- **Note**: Affects error messages and logging

#### `MONGODB_URI` (Required)
- **Description**: MongoDB database connection string
- **Local Format**: `mongodb://localhost:27017/smart-diet-sl`
- **Atlas Format**: `mongodb+srv://username:password@cluster.mongodb.net/smart-diet-sl`
- **Note**: 
  - For local: Make sure MongoDB is installed and running
  - For Atlas: Replace username, password, and cluster URL

#### `JWT_SECRET` (Required)
- **Description**: Secret key for signing JWT tokens
- **Security**: MUST be changed to a strong random string
- **Generate**: Use `openssl rand -base64 32` or any random string generator
- **Example**: `JWT_SECRET=abc123xyz789...` (at least 32 characters)
- **Warning**: Never share this or commit it to Git!

#### `JWT_EXPIRE` (Required)
- **Description**: JWT token expiration time
- **Default**: 7d (7 days)
- **Examples**: 
  - `7d` = 7 days
  - `24h` = 24 hours
  - `1h` = 1 hour

#### `CLOUDINARY_CLOUD_NAME` (Optional)
- **Description**: Your Cloudinary cloud name
- **Get it from**: https://cloudinary.com/dashboard
- **Note**: Required only if you want image uploads

#### `CLOUDINARY_API_KEY` (Optional)
- **Description**: Your Cloudinary API key
- **Get it from**: https://cloudinary.com/dashboard

#### `CLOUDINARY_API_SECRET` (Optional)
- **Description**: Your Cloudinary API secret
- **Get it from**: https://cloudinary.com/dashboard
- **Warning**: Keep this secret!

#### `CLIENT_URL` (Required)
- **Description**: Frontend URL for CORS (Cross-Origin Resource Sharing)
- **Development**: `http://localhost:5173`
- **Production**: `https://your-frontend-domain.com`
- **Note**: Must match your frontend URL exactly

### Client Variables

#### `VITE_API_URL` (Required)
- **Description**: Backend API base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-api-domain.com/api`
- **Note**: Must start with `VITE_` for Vite to expose it to the frontend

---

## How to Get Credentials

### MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Create a database user:
   - Username: `your_username`
   - Password: `your_password` (save this!)
5. Whitelist IP address:
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add your server's IP
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/smart-diet-sl`

### Cloudinary (For Image Uploads)

1. Go to https://cloudinary.com
2. Sign up for a free account
3. Go to Dashboard
4. Copy:
   - **Cloud Name**: Found at the top of dashboard
   - **API Key**: Found in "Account Details"
   - **API Secret**: Found in "Account Details" (click "Reveal")

### Generate JWT Secret

**Option 1: Using OpenSSL (if installed)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Use any secure random string generator
- Minimum 32 characters recommended
- Example: `aB3$kL9mN2pQ5rS7tU1vW4xY6zA8bC0dE`

---

## Security Best Practices

1. **Never commit `.env` files to Git**
   - They're already in `.gitignore`
   - Double-check before committing

2. **Use different values for development and production**
   - Development: Can use simpler values
   - Production: Must use strong, unique values

3. **Rotate secrets regularly**
   - Especially `JWT_SECRET` in production

4. **Don't share `.env` files**
   - Never email or share them
   - Use secure methods to share credentials with team

5. **Use environment-specific files**
   - `.env.development` for development
   - `.env.production` for production
   - `.env.local` for local overrides (already in .gitignore)

---

## Troubleshooting

### "MONGODB_URI is not defined"
- Make sure `.env` file exists in `Server` folder
- Check that `MONGODB_URI` is spelled correctly
- No spaces around the `=` sign

### "JWT_SECRET is not defined"
- Add `JWT_SECRET` to your `.env` file
- Make sure it's a strong random string

### CORS Errors
- Check that `CLIENT_URL` matches your frontend URL exactly
- Include protocol (`http://` or `https://`)
- No trailing slash

### Port Already in Use
- Change `PORT` to a different number (e.g., 5001, 3001)
- Or stop the application using that port

---

## Quick Setup Checklist

- [ ] Create `Server/.env` file
- [ ] Add `MONGODB_URI` (local or Atlas)
- [ ] Add `JWT_SECRET` (strong random string)
- [ ] Add `PORT=5000`
- [ ] Add `CLIENT_URL=http://localhost:5173`
- [ ] (Optional) Add Cloudinary credentials
- [ ] Create `Client/.env` file
- [ ] Add `VITE_API_URL=http://localhost:5000/api`
- [ ] Verify both files are in `.gitignore`

---

## Example Files

### Minimal Server `.env` (Required Only)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl
JWT_SECRET=change_this_to_a_random_string_at_least_32_characters_long
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Minimal Client `.env` (Required Only)
```env
VITE_API_URL=http://localhost:5000/api
```

