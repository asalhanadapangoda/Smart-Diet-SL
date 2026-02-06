# Smart Diet SL - Complete Project Analysis

## Executive Summary

**Smart Diet SL** is a comprehensive MERN (MongoDB, Express.js, React, Node.js) stack web application designed specifically for Sri Lankan users to manage their nutrition, diet plans, and healthy eating habits. The application combines e-commerce functionality (product browsing, cart, checkout) with advanced nutrition tracking features, culturally-tailored diet recommendations, and a **marketplace platform** where farmers can sell their products directly to consumers.

---

## 1. Project Overview

### Purpose
A full-stack nutrition advisory platform that:
- Provides Sri Lankan-specific diet plans and traditional food information
- Offers e-commerce functionality for healthy products
- **Enables farmers to list and sell products through a marketplace**
- Tracks nutrition through meal logging and calculators
- Supports multiple languages (English, Sinhala, Tamil)
- Generates personalized meal plates based on health goals
- **AI-powered nutrition chatbot (LankaNutri Advisor)**

### Target Audience
- Sri Lankan individuals seeking nutrition guidance
- Users with specific health goals (weight loss, diabetes management, general health)
- People interested in traditional Sri Lankan foods and their nutritional values
- **Farmers looking to sell fresh produce and healthy products**
- **Administrators managing the platform**

---

## 2. Architecture & Tech Stack

### Frontend (Client)
- **Framework**: React 19.2.0 (latest version)
- **Build Tool**: Vite (using rolldown-vite@7.2.2 for faster builds)
- **State Management**: Redux Toolkit 2.10.1
- **Routing**: React Router DOM 6.26.1
- **HTTP Client**: Axios 1.13.2
- **Styling**: Tailwind CSS 4.1.17
- **Notifications**: React Hot Toast 2.4.1
- **Language**: JavaScript (ES6+ modules)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.19.3
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: Bcryptjs 3.0.3
- **File Upload**: Multer 2.0.2 + Cloudinary 2.8.0
- **AI Integration**: 
  - **Groq SDK 0.35.0** (for LankaNutri Advisor chatbot)
  - OpenAI 6.9.0 (available for future use)
- **Environment**: dotenv 17.2.3

### Development Tools
- **Root**: Concurrently 9.1.0 (run client + server simultaneously)
- **Backend Dev**: Nodemon 3.1.11
- **Frontend Linting**: ESLint 9.39.1

---

## 3. Project Structure

```
Smart-Diet-SL/
├── Client/                    # React Frontend Application
│   ├── src/
│   │   ├── api/              # Axios instance configuration
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable components
│   │   │   └── common/       # Header, Footer, DailyTip, ProtectedRoute, AdminRoute, FarmerRoute, Chatbot
│   │   ├── contexts/         # React Context providers
│   │   │   └── LanguageContext.jsx  # Multi-language support
│   │   ├── features/         # Feature-based Redux slices
│   │   │   └── diet/         # Diet-related Redux logic
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin dashboard & management
│   │   │   ├── auth/         # Login & Registration
│   │   │   ├── calculator/   # Nutrition calculator
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── checkout/     # Checkout process
│   │   │   ├── diet-planner/ # Diet planning tool
│   │   │   ├── diet-plans/   # Browse diet plans
│   │   │   ├── farmer/       # Farmer dashboard & product management
│   │   │   ├── home/         # Homepage
│   │   │   ├── meal-logging/ # Meal photo logging
│   │   │   ├── products/     # Product listing & details
│   │   │   ├── profile/      # User profile
│   │   │   └── sri-lankan-plates/  # Sri Lankan plate generator
│   │   ├── services/         # API service functions
│   │   ├── store/            # Redux store configuration
│   │   │   └── slices/       # Redux slices (auth, cart, products, admin, farmer)
│   │   ├── App.jsx           # Main App component with routing
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Public static files
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
├── Server/                    # Node.js Backend Application
│   ├── config/               # Configuration files
│   │   ├── database.js       # MongoDB connection setup
│   │   └── cloudinary.js      # Cloudinary image upload config
│   ├── controllers/          # Route controllers (business logic)
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── chatbotController.js  # LankaNutri Advisor chatbot
│   │   ├── dailyTipController.js
│   │   ├── dietController.js
│   │   ├── dietPlanController.js
│   │   ├── farmerController.js   # Farmer product & order management
│   │   ├── mealLogController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── sriLankanPlateController.js
│   │   └── traditionalFoodController.js
│   ├── data/                 # Sample data files
│   │   └── sampleTraditionalFoods.js
│   ├── middlewares/          # Express middlewares
│   │   └── auth.js           # JWT authentication middleware (protect, admin, farmer)
│   ├── models/               # Mongoose database models
│   │   ├── User.js
│   │   ├── Product.js        # Includes farmer field & approval status
│   │   ├── Order.js
│   │   ├── DietPlan.js
│   │   ├── DailyTip.js
│   │   ├── MealLog.js
│   │   ├── SriLankanPlate.js
│   │   ├── TraditionalFood.js
│   │   └── FarmerIncome.js   # Farmer payout tracking
│   ├── routes/               # API route definitions
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── dailyTipRoutes.js
│   │   ├── diet.js
│   │   ├── dietPlanRoutes.js
│   │   ├── farmerRoutes.js   # Farmer-specific routes
│   │   ├── mealLogRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── sriLankanPlateRoutes.js
│   │   ├── traditionalFoodRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/              # Utility scripts
│   │   ├── seedData.js       # Database seeding script
│   │   └── checkEnv.js       # Environment variable validation
│   ├── utils/                # Helper functions
│   │   └── generateToken.js  # JWT token generation
│   ├── server.js             # Server entry point
│   └── package.json          # Backend dependencies
│
├── Root Level Files
│   ├── daily-tips.json       # Sample daily tips data
│   ├── sample-dietplans.json # Sample diet plans
│   ├── traditional-foods.json # Sample traditional foods
│   ├── package.json          # Root package.json (scripts to run both)
│   ├── README.md             # Main documentation
│   ├── SETUP_GUIDE.md        # Detailed setup instructions
│   ├── SRI_LANKAN_FEATURES.md # Sri Lankan features documentation
│   ├── ENV_GUIDE.md          # Environment variables guide
│   ├── DB_CONNECTION_CHECK.md # Database troubleshooting
│   ├── HOW_TO_IMPORT_JSON.md # JSON import guide
│   ├── SEED_DATA_GUIDE.md    # Data seeding guide
│   ├── TROUBLESHOOTING.md    # Common issues & solutions
│   └── restart-server.ps1    # PowerShell script to restart server
```

---

## 4. Database Models Analysis

### 4.1 User Model
**File**: `Server/models/User.js`

**Schema Fields**:
- `name` (String, required)
- `email` (String, required, unique, lowercase)
- `password` (String, required, min 6 chars, hashed with bcrypt)
- `phone` (String, optional)
- `address` (String, optional)
- `avatar` (String, URL to profile image)
- `role` (Enum: 'user' | 'farmer' | 'admin', default: 'user')
- `timestamps` (createdAt, updatedAt)

**Features**:
- Password hashing with bcrypt (salt rounds: 10)
- Password comparison method
- Pre-save middleware for password hashing
- **Three-tier role system: user, farmer, admin**

### 4.2 Product Model
**File**: `Server/models/Product.js`

**Schema Fields**:
- `farmer` (ObjectId, ref: User, optional, indexed) - **Links product to farmer**
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required, min: 0)
- `image` (String, required - Cloudinary URL)
- `category` (Enum: 'vegetables' | 'fruits' | 'grains' | 'proteins' | 'dairy' | 'spices' | 'other')
- `nutrition` (Object with calories, protein, carbs, fat, fiber)
- `stock` (Number, default: 0, min: 0)
- `isAvailable` (Boolean, default: true)
- `approvalStatus` (Enum: 'pending' | 'approved' | 'rejected', default: 'approved', indexed) - **For farmer product approval**
- `rejectionReason` (String, optional) - **Admin feedback for rejected products**
- `timestamps`

**Key Features**:
- **Farmer-product relationship** for marketplace functionality
- **Product approval workflow** for farmer-submitted products
- Admin can approve/reject farmer products

### 4.3 Order Model
**File**: `Server/models/Order.js`

**Schema Fields**:
- `user` (ObjectId, ref: User, required)
- `orderItems` (Array of objects with product, name, quantity, price, image, **farmer**)
- `shippingAddress` (Object with address, city, postalCode, country)
- `paymentMethod` (Enum: 'cash' | 'card' | 'online', default: 'cash')
- `paymentResult` (Object for payment gateway response)
- `itemsPrice`, `shippingPrice`, `totalPrice` (Numbers)
- `isPaid`, `paidAt` (Boolean, Date)
- `isDelivered`, `deliveredAt` (Boolean, Date)
- `timestamps`

**Key Features**:
- **Order items include farmer reference** for tracking which farmer sold what
- Supports multiple payment methods

### 4.4 FarmerIncome Model
**File**: `Server/models/FarmerIncome.js`

**Schema Fields**:
- `farmer` (ObjectId, ref: User, required, indexed)
- `order` (ObjectId, ref: Order, required, indexed)
- `amount` (Number, required, min: 0)
- `paymentStatus` (Enum: 'pending' | 'paid', default: 'paid', indexed)
- `paidAt` (Date, default: now)
- `timestamps`

**Key Features**:
- **Tracks farmer payouts per order**
- **Unique index on (farmer, order)** to prevent duplicate payouts
- Supports pending/paid status for payout management

### 4.5 DietPlan Model
**File**: `Server/models/DietPlan.js`

**Schema Fields**:
- `user` (ObjectId, ref: User, required)
- `input` (Object: weight, height, age, bloodPressure, sugar, bodyType, activityLevel)
- `planText` (String, required - generated diet plan text)
- `metadata` (Object for additional data)
- `timestamps`

### 4.6 TraditionalFood Model
**File**: `Server/models/TraditionalFood.js`

**Schema Fields**:
- `name` (Object with en, si, ta - multilingual names)
- `type` (Enum: 'ingredient' | 'dish' | 'beverage')
- `category` (Enum: 'rice' | 'grains' | 'vegetables' | 'fruits' | 'proteins' | 'spices' | 'beverages' | 'other')
- `nutrition` (Object: calories, protein, carbs, fat, fiber, iron, calcium, glycemicIndex)
- `servingSize` (Object: amount, unit)
- `description` (Object with en, si, ta)
- `traditionalUses`, `healthBenefits` (Arrays)
- `image` (String)
- `isCommon`, `isAffordable` (Booleans)
- `preparationMethods` (Array)
- `timestamps`

### 4.7 MealLog Model
**File**: `Server/models/MealLog.js`

**Schema Fields**:
- `user` (ObjectId, ref: User, required)
- `mealType` (Enum: 'breakfast' | 'lunch' | 'dinner' | 'snack')
- `image` (String - meal photo URL)
- `recognizedItems` (Array: name, confidence, estimatedPortion)
- `manualItems` (Array: foodId, name, portion, calories)
- `totalNutrition` (Object: calories, protein, carbs, fat, fiber)
- `notes` (String)
- `date` (Date, default: now)
- `timestamps`

**Indexes**:
- `{ user: 1, date: -1 }` - for efficient user meal history queries
- `{ user: 1, mealType: 1, date: -1 }` - for filtering by meal type

### 4.8 DailyTip Model
**File**: `Server/models/DailyTip.js`

**Schema Fields**:
- `tip` (Object with en, si, ta - multilingual tips)
- `category` (Enum: 'weight-loss' | 'diabetes' | 'general-health' | 'portion-control' | 'cooking-tip' | 'substitution' | 'hydration')
- `difficulty` (Enum: 'easy' | 'medium' | 'hard', default: 'easy')
- `culturalRelevance` (String, default: 'high')
- `relatedFoods` (Array)
- `date` (Date)
- `isActive` (Boolean, default: true)
- `timestamps`

**Indexes**:
- `{ date: 1, isActive: 1 }` - for efficient daily tip retrieval

### 4.9 SriLankanPlate Model
**File**: `Server/models/SriLankanPlate.js`

**Schema Fields**:
- `name` (Object with en, si, ta)
- `goal` (Enum: 'weight-loss' | 'weight-gain' | 'diabetes' | 'general-health')
- `items` (Array: foodId, name, portion, nutrition)
- `totalNutrition` (Object: calories, protein, carbs, fat, fiber)
- `description` (Object with en, si, ta)
- `substitutions` (Array: original, substitute, reason)
- `isBusyLifeFriendly` (Boolean)
- `prepTime` (Number - minutes)
- `image` (String)
- `timestamps`

---

## 5. API Endpoints

### 5.1 Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user (Public)
- `POST /api/auth/login` - Login user (Public)
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### 5.2 Product Routes (`/api/products`)
- `GET /api/products` - Get all products (with category/search filters, only approved) (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### 5.3 Order Routes (`/api/orders`)
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)

### 5.4 Diet Plan Routes (`/api/diet-plans`)
- `GET /api/diet-plans` - Get all diet plans (Public)
- `GET /api/diet-plans/:id` - Get single diet plan (Public)
- `POST /api/diet-plans` - Create diet plan (Admin)
- `PUT /api/diet-plans/:id` - Update diet plan (Admin)
- `DELETE /api/diet-plans/:id` - Delete diet plan (Admin)

### 5.5 Traditional Food Routes (`/api/traditional-foods`)
- `GET /api/traditional-foods` - Get all foods (with category/language filters) (Public)
- `GET /api/traditional-foods/:id` - Get single food (Public)
- `POST /api/traditional-foods` - Create food (Admin)

### 5.6 Daily Tip Routes (`/api/daily-tips`)
- `GET /api/daily-tips/today` - Get today's tip (with language parameter) (Public)
- `GET /api/daily-tips` - Get all tips (Public)
- `POST /api/daily-tips` - Create tip (Admin)

### 5.7 Meal Log Routes (`/api/meal-logs`)
- `POST /api/meal-logs` - Log a meal with image upload (Protected)
- `GET /api/meal-logs` - Get user's meal logs (Protected)
- `GET /api/meal-logs/stats` - Get nutrition statistics (Protected)

### 5.8 Sri Lankan Plate Routes (`/api/sri-lankan-plates`)
- `GET /api/sri-lankan-plates/generate` - Generate personalized plate (query params: goal, calories, language) (Public)

### 5.9 Upload Routes (`/api/upload`)
- `POST /api/upload` - Upload image to Cloudinary (Protected)

### 5.10 Admin Routes (`/api/admin`)
- `GET /api/admin/stats` - Get admin dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)
- `GET /api/admin/product-approvals` - Get pending product approvals (Admin)
- `PUT /api/admin/product-approvals/:id/approve` - Approve farmer product (Admin)
- `PUT /api/admin/product-approvals/:id/reject` - Reject farmer product (Admin)

### 5.11 Farmer Routes (`/api/farmer`)
- `GET /api/farmer/products` - Get my (farmer's) products (Farmer)
- `POST /api/farmer/products` - Create product (pending approval) (Farmer)
- `PUT /api/farmer/products/:id/availability` - Toggle product availability (Farmer)
- `GET /api/farmer/orders` - Get orders containing my products (Farmer)
- `GET /api/farmer/income` - Get income summary and payouts (Farmer)

### 5.12 Chatbot Routes (`/api/chatbot`)
- `POST /api/chatbot/new` - Start new conversation (Public)
- `POST /api/chatbot/chat` - Send message to LankaNutri Advisor (Public)
- `POST /api/chatbot/clear` - Clear conversation history (Public)

### 5.13 Health Check Routes
- `GET /api/health` - Server health check (Public)
- `GET /api/health/db` - Database connection status (Public)

---

## 6. State Management (Redux)

### Redux Store Structure
Located in: `Client/src/store/store.js`

**Reducers**:
1. **auth** - User authentication state
   - `user`, `token`, `loading`, `error`, `isAuthenticated`
   - Actions: `register`, `login`, `logout`, `getProfile`, `updateProfile`

2. **products** - Product listings state
   - Product data, filters, loading states

3. **cart** - Shopping cart state
   - Cart items, totals, persisted in localStorage

4. **diet** - Diet-related state
   - Diet plans, calculator results, meal logs

5. **admin** - Admin dashboard state
   - Users, orders, statistics

6. **farmer** - Farmer dashboard state (NEW)
   - Farmer products, orders, income

### Redux Slices Location
- `Client/src/store/slices/authSlice.js`
- `Client/src/store/slices/productSlice.js`
- `Client/src/store/slices/cartSlice.js`
- `Client/src/store/slices/adminSlice.js`
- `Client/src/store/slices/farmerSlice.js`
- `Client/src/features/diet/dietSlice.js`

---

## 7. Authentication & Authorization

### JWT Authentication Flow
1. User registers/logs in
2. Server validates credentials
3. Server generates JWT token using `generateToken()` utility
4. Token stored in localStorage on client
5. Token sent in `Authorization: Bearer <token>` header for protected routes
6. `protect` middleware verifies token on server
7. `admin` middleware checks user role for admin routes
8. **`farmer` middleware checks user role for farmer routes**

### Protected Routes (Frontend)
- `ProtectedRoute` component wraps routes requiring authentication
- `AdminRoute` component wraps admin-only routes
- **`FarmerRoute` component wraps farmer-only routes**
- All check authentication state from Redux store

### Middleware (Backend)
- **protect**: Verifies JWT token, attaches user to request
- **admin**: Checks if user role is 'admin'
- **farmer**: Checks if user role is 'farmer'
- All handle database connection errors gracefully

### Role System
- **user**: Regular customers, can browse, purchase, track nutrition
- **farmer**: Can list products, manage inventory, view orders, track income
- **admin**: Full system access, manage users, approve products, view all orders

---

## 8. Key Features

### 8.1 E-Commerce Features
- ✅ Product browsing with categories
- ✅ Product search and filtering
- ✅ Shopping cart functionality
- ✅ Checkout process
- ✅ Order management
- ✅ Product management (Admin)
- ✅ **Farmer marketplace** (Farmers can sell products)
- ✅ **Product approval workflow** (Admin approves farmer products)

### 8.2 Nutrition Tracking
- ✅ Nutrition calculator
- ✅ Meal logging with photo upload
- ✅ Meal history and statistics
- ✅ Nutrition breakdown per meal

### 8.3 Diet Planning
- ✅ Personalized diet plan generation
- ✅ Goal-based meal plate generation
- ✅ Diet plan recommendations
- ✅ Custom diet plan creation (Admin)

### 8.4 Sri Lankan Localization
- ✅ Multi-language support (English, Sinhala, Tamil)
- ✅ Traditional food database
- ✅ Sri Lankan plate generator
- ✅ Daily tips in multiple languages
- ✅ Culturally relevant nutrition guidance

### 8.5 User Management
- ✅ User registration and login
- ✅ Profile management
- ✅ Avatar upload
- ✅ Order history
- ✅ **Role-based access control** (user, farmer, admin)

### 8.6 Admin Features
- ✅ Admin dashboard
- ✅ User management (including role updates)
- ✅ Product CRUD operations
- ✅ Order management
- ✅ Daily tip management
- ✅ Traditional food management
- ✅ **Product approval system** (approve/reject farmer products)

### 8.7 Farmer Features (NEW)
- ✅ Farmer dashboard
- ✅ Product listing (with approval workflow)
- ✅ Product availability management
- ✅ Order tracking (orders containing their products)
- ✅ Income tracking and payout history
- ✅ Product image upload via Cloudinary

### 8.8 AI Chatbot (NEW)
- ✅ **LankaNutri Advisor** - AI-powered nutrition chatbot
- ✅ Uses Groq SDK for fast AI responses
- ✅ Specialized in Sri Lankan foods and nutrition
- ✅ Conversation history management
- ✅ Multi-language support
- ✅ Provides meal plans, nutrition analysis, and healthy tips

---

## 9. Frontend Pages & Components

### Public Pages
1. **Home** (`/`) - Landing page with features overview
2. **Products** (`/products`) - Product listing with filters
3. **Product Detail** (`/products/:id`) - Individual product view
4. **Cart** (`/cart`) - Shopping cart
5. **Checkout** (`/checkout`) - Order checkout
6. **Calculator** (`/calculator`) - Nutrition calculator
7. **Diet Plans** (`/diet-plans`) - Browse diet plans
8. **Sri Lankan Plates** (`/sri-lankan-plates`) - Plate generator
9. **Login** (`/login`) - User login
10. **Register** (`/register`) - User registration

### Protected Pages
1. **Diet Planner** (`/diet-planner`) - Create personalized diet plans
2. **Meal Logging** (`/meal-logging`) - Log meals with photos
3. **Profile** (`/profile`) - User profile management
4. **Orders** (`/orders`) - Order history
5. **Order Detail** (`/orders/:id`) - Order details

### Farmer Pages (NEW)
1. **Farmer Dashboard** (`/farmer`) - Farmer overview
2. **Farmer Products** (`/farmer/products`) - Manage products
3. **Add Product** (`/farmer/products/new`) - Create product
4. **Farmer Orders** (`/farmer/orders`) - View orders with their products
5. **Farmer Income** (`/farmer/income`) - Income and payout tracking

### Admin Pages
1. **Admin Dashboard** (`/admin`) - Admin overview
2. **Products Admin** (`/admin/products`) - Manage products
3. **Add Product** (`/admin/products/new`) - Create product
4. **Edit Product** (`/admin/products/:id/edit`) - Edit product
5. **Orders Admin** (`/admin/orders`) - Manage orders
6. **Users Admin** (`/admin/users`) - Manage users
7. **Product Approvals** (`/admin/product-approvals`) - Approve/reject farmer products

### Common Components
- **Header** - Navigation bar with language switcher
- **Footer** - Footer with links
- **DailyTip** - Daily tip display component
- **ImageUpload** - Image upload component
- **ProtectedRoute** - Route guard for authenticated users
- **AdminRoute** - Route guard for admin users
- **FarmerRoute** - Route guard for farmer users
- **Chatbot** - LankaNutri Advisor chatbot component
- **AdminLayout** - Layout wrapper for admin pages

---

## 10. Configuration & Environment Variables

### Server Environment Variables (`.env` in Server/)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here  # For LankaNutri Advisor chatbot
OPENAI_API_KEY=sk-your-openai-api-key-here  # Optional, for future use
OPENAI_MODEL=gpt-4o-mini
```

### Client Environment Variables (`.env` in Client/)
```
VITE_API_URL=http://localhost:5000/api
```

### Database Configuration
- MongoDB connection with retry logic
- Connection state monitoring
- Error handling for database failures
- Health check endpoints for debugging

### Cloudinary Configuration
- Image upload middleware
- Automatic URL generation
- Support for avatar, product, and meal images
- Meal photo storage

### AI Chatbot Configuration
- **Groq SDK** for fast AI responses
- System prompt specialized for Sri Lankan nutrition
- Conversation history stored in memory (Map)
- **Note**: In production, use Redis or database for conversation storage

---

## 11. Security Features

### Implemented
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ Protected API routes with middleware
- ✅ Role-based access control (user/farmer/admin)
- ✅ CORS configuration
- ✅ Input validation on models
- ✅ Secure token storage in localStorage
- ✅ Token expiration handling
- ✅ **Product approval workflow** prevents unauthorized product listings

### Potential Improvements
- Add rate limiting for API endpoints
- Implement CSRF protection
- Add input sanitization (e.g., express-validator)
- Implement password strength requirements
- Add email verification
- Add two-factor authentication option
- Implement session management improvements
- **Store conversation history in database/Redis** instead of memory
- **Add API rate limiting for chatbot** to prevent abuse

---

## 12. Error Handling

### Backend
- Global error handling middleware
- Database connection error handling
- JWT error handling (expired, invalid tokens)
- Uncaught exception handlers
- Unhandled rejection handlers
- Detailed error logging in development
- **Graceful degradation** when Groq API is unavailable

### Frontend
- Axios interceptors for error handling
- Automatic logout on 401 errors
- Error messages displayed via React Hot Toast
- Loading states for async operations
- Redux error states
- **Chatbot error handling** with user-friendly messages

---

## 13. Code Quality & Organization

### Strengths
- ✅ Clean separation of concerns (MVC pattern)
- ✅ Modular file structure
- ✅ Consistent naming conventions
- ✅ ES6+ modules throughout
- ✅ Redux Toolkit for state management
- ✅ Component-based React architecture
- ✅ Database indexes for performance
- ✅ Comprehensive documentation files
- ✅ **Role-based feature separation** (farmer, admin, user)

### Areas for Improvement
- Add unit tests (Jest, React Testing Library)
- Add integration tests
- Add API documentation (Swagger/OpenAPI)
- Implement code linting rules
- Add TypeScript for type safety
- Add PropTypes or TypeScript for component props
- Implement error boundary components
- Add performance monitoring
- **Add conversation persistence** for chatbot

---

## 14. Dependencies Analysis

### Critical Dependencies
- **Express 5.1.0** - Latest major version (may have breaking changes)
- **React 19.2.0** - Very recent version
- **Mongoose 8.19.3** - Latest stable
- **Redux Toolkit 2.10.1** - Modern Redux
- **Groq SDK 0.35.0** - Fast AI inference for chatbot

### Potential Issues
- **rolldown-vite@7.2.2** - Custom Vite build, may have compatibility issues
- **openai@6.9.0** - Included but not actively used (chatbot uses Groq)
- **uuid@13.0.0** - Latest version, may not be necessary if crypto.randomUUID is available

### Security Audit Recommendations
- Regularly run `npm audit`
- Update dependencies to latest secure versions
- Monitor for security vulnerabilities
- **Review Groq SDK usage** for API key security

---

## 15. Performance Considerations

### Implemented
- ✅ Database indexes on frequently queried fields
- ✅ Efficient querying (select only needed fields)
- ✅ Image optimization via Cloudinary
- ✅ React lazy loading (can be added)
- ✅ Redux state normalization
- ✅ **Indexed fields** for farmer products, approval status

### Optimization Opportunities
- Implement React lazy loading for route components
- Add pagination for product listings
- Implement caching strategies (Redis)
- Add database query optimization
- Implement image lazy loading
- Add service worker for offline support
- Optimize bundle size with code splitting
- **Cache chatbot responses** for common queries
- **Implement pagination** for farmer products and orders

---

## 16. Deployment Readiness

### Current State
- ✅ Environment variable configuration
- ✅ Error handling in place
- ✅ Health check endpoints
- ✅ Production build scripts
- ✅ CORS configuration
- ✅ **Role-based access control** implemented

### Pre-Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET
- [ ] Configure production MongoDB
- [ ] Set up Cloudinary production account
- [ ] Configure production CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Configure environment-specific variables
- [ ] Set up monitoring and logging (e.g., Winston, Sentry)
- [ ] Set up backup strategy for MongoDB
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation
- [ ] **Configure Groq API key** for production
- [ ] **Set up conversation storage** (Redis/database) for chatbot
- [ ] **Test farmer product approval workflow**
- [ ] **Test farmer income tracking**

---

## 17. Unique Features & Sri Lankan Focus

### Traditional Food Database
- Comprehensive database of Sri Lankan ingredients
- Multi-language support (English, Sinhala, Tamil)
- Nutritional profiles including glycemic index
- Traditional uses and health benefits
- Affordability and commonality indicators

### Sri Lankan Plate Generator
- Goal-based meal generation
- Diabetes-friendly options (low GI)
- Busy life hack filter
- Local ingredient substitutions
- Culturally relevant meal suggestions

### Multi-Language Support
- Full UI translation support
- Language preference persistence
- API endpoints support language parameters
- Culturally appropriate content

### Daily Tips System
- One actionable tip per day
- Culturally relevant suggestions
- Multiple categories (weight loss, diabetes, general health)
- Multi-language tips

### LankaNutri Advisor Chatbot
- **AI-powered nutrition assistant** specialized in Sri Lankan foods
- Uses Groq SDK for fast, cost-effective AI responses
- Provides meal plans, nutrition analysis, healthy substitutions
- Culturally aware responses
- Multi-language conversation support

### Farmer Marketplace
- **Direct-to-consumer marketplace** for farmers
- Product approval workflow ensures quality
- Income tracking for farmers
- Order management per farmer

---

## 18. Testing Status

### Current State
- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests

### Recommended Testing Strategy
1. **Unit Tests**
   - Redux reducers and actions
   - Utility functions
   - React components
   - API controllers
   - **Farmer product approval logic**
   - **Chatbot conversation handling**

2. **Integration Tests**
   - API endpoint testing
   - Database operations
   - Authentication flows
   - **Farmer product creation and approval**
   - **Order processing with farmer products**

3. **E2E Tests**
   - User registration/login
   - Product browsing and cart
   - Checkout process
   - Admin operations
   - **Farmer product listing workflow**
   - **Chatbot interactions**

---

## 19. Documentation Quality

### Excellent Documentation
- ✅ Comprehensive README.md
- ✅ Detailed SETUP_GUIDE.md
- ✅ SRI_LANKAN_FEATURES.md
- ✅ Environment variable guides
- ✅ Database connection troubleshooting
- ✅ Data seeding guides
- ✅ Troubleshooting guide

### Could Be Enhanced
- Add inline code comments
- Add JSDoc comments for functions
- Create API documentation
- Add architecture diagrams
- Create user guide
- **Document farmer onboarding process**
- **Document chatbot API usage**

---

## 20. Recommendations

### Immediate Improvements
1. **Add Error Boundaries** - Catch React component errors gracefully
2. **Implement Input Validation** - Use express-validator for API inputs
3. **Add Rate Limiting** - Prevent API abuse, especially for chatbot
4. **Add Logging** - Winston or similar for production logging
5. **Environment Validation** - Validate required env vars on startup
6. **Conversation Storage** - Move chatbot conversations to Redis/database

### Short-Term Enhancements
1. **Add Unit Tests** - Start with critical paths (auth, orders, farmer products)
2. **Implement Pagination** - For products, orders, meal logs, farmer products
3. **Add Search Functionality** - Enhanced product search
4. **Email Notifications** - Order confirmations, product approvals, password resets
5. **Social Login** - Google/Facebook authentication
6. **Farmer Onboarding** - Streamlined process for farmers to join

### Long-Term Improvements
1. **TypeScript Migration** - Add type safety
2. **Progressive Web App** - Offline support, app-like experience
3. **Real-time Features** - WebSocket for order updates, notifications
4. **Advanced Analytics** - User behavior tracking, farmer performance metrics
5. **AI Integration** - Enhanced meal recognition, diet plan generation
6. **Mobile App** - React Native version
7. **Payment Gateway** - Online payment integration
8. **Review System** - Product reviews and ratings
9. **Farmer Verification** - KYC/verification process for farmers

---

## 21. Project Strengths

1. ✅ **Well-Structured** - Clean architecture and separation of concerns
2. ✅ **Feature-Rich** - Comprehensive functionality for nutrition management
3. ✅ **Cultural Relevance** - Sri Lankan-specific features and content
4. ✅ **Modern Stack** - Latest React, Express, and tools
5. ✅ **Scalable Architecture** - Modular design allows easy expansion
6. ✅ **Good Documentation** - Multiple guides for setup and troubleshooting
7. ✅ **Multi-Language** - Support for English, Sinhala, Tamil
8. ✅ **Authentication** - Secure JWT-based auth system
9. ✅ **Admin Panel** - Complete admin functionality
10. ✅ **Image Upload** - Cloudinary integration for media handling
11. ✅ **Marketplace** - Farmer-to-consumer platform
12. ✅ **AI Chatbot** - LankaNutri Advisor for nutrition guidance
13. ✅ **Role-Based Access** - Three-tier role system (user, farmer, admin)

---

## 22. Project Weaknesses

1. ❌ **No Testing** - Lack of automated tests
2. ❌ **No Type Safety** - Pure JavaScript, no TypeScript
3. ⚠️ **Limited Error Handling** - Could be more comprehensive
4. ⚠️ **No Rate Limiting** - API endpoints unprotected
5. ⚠️ **No Input Validation** - Missing express-validator
6. ⚠️ **No Logging** - No structured logging system
7. ⚠️ **Security Hardening** - Could add more security layers
8. ⚠️ **Performance** - No pagination, caching, or optimization strategies
9. ⚠️ **Monitoring** - No application monitoring or analytics
10. ⚠️ **Chatbot Storage** - Conversations stored in memory (not persistent)
11. ⚠️ **No Payment Gateway** - Only cash payment option
12. ⚠️ **No Reviews** - Missing product review/rating system

---

## 23. Conclusion

**Smart Diet SL** is a well-architected, feature-complete MERN stack application that successfully combines e-commerce functionality with advanced nutrition tracking features, specifically tailored for Sri Lankan users. The project demonstrates:

- Strong architectural patterns
- Modern technology stack
- Cultural localization
- Comprehensive documentation
- Scalable structure
- **Marketplace functionality** for farmers
- **AI-powered nutrition assistance**

The application is **production-ready** with minor improvements, particularly around testing, security hardening, monitoring, and conversation persistence for the chatbot. The codebase is maintainable and extensible, making it a solid foundation for a nutrition advisory platform with marketplace capabilities.

**Overall Assessment**: **8.5/10**
- Architecture: 9/10
- Features: 9.5/10 (enhanced with farmer marketplace and chatbot)
- Code Quality: 8/10
- Documentation: 9/10
- Security: 7/10
- Testing: 0/10
- Performance: 7/10

---

## 24. Recent Additions & Updates

### Farmer Marketplace System
- Complete farmer role implementation
- Product approval workflow
- Farmer income tracking
- Order management per farmer

### AI Chatbot Integration
- LankaNutri Advisor using Groq SDK
- Specialized in Sri Lankan nutrition
- Conversation management
- Multi-language support

### Enhanced Product Model
- Farmer-product relationship
- Approval status workflow
- Rejection reason tracking

---

*Analysis completed: 2024*
*Project: Smart Diet SL*
*Tech Stack: MERN (MongoDB, Express.js, React, Node.js)*
*Latest Features: Farmer Marketplace, AI Chatbot (LankaNutri Advisor)*
