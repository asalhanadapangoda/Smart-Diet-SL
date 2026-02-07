# Smart Diet SL

A comprehensive MERN stack application for managing nutrition and diet plans designed specifically for Sri Lankan diets. Combines e-commerce, nutrition tracking tools, AI-powered advice, and a farmer marketplace.

---

## Features

### Core Features
- **User Authentication** – Register & login with JWT (user, farmer, admin roles)
- **E-Commerce** – Browse products, search, filter by category, cart, checkout
- **Nutrition Calculator** – 154+ traditional Sri Lankan foods with calories, protein, carbs, fat, fiber
- **Sri Lankan Plate Generator** – Generate meal ideas by goal, calories, BMI
- **Diet Planner** – Personalized diet plans (login required)
- **Diet Plans** – Browse recommended diet plans
- **Meal Logging** – Log meals with photos and manual entries
- **User Profile** – Update name, email, phone, address

### Sri Lankan Specific
- **Traditional Food Database** – Rice, grains, vegetables, fruits, proteins, spices, dishes (EN/SI/TA names)
- **AI LankaNutri Advisor Chatbot** – Nutrition advice powered by Groq (Llama)
- **Multi-Language** – English, Sinhala, Tamil
- **Daily Tips** – Culturally relevant nutrition tips in 3 languages

### Marketplace
- **Farmer Dashboard** – Add products, manage listings, view orders, track income
- **Product Approval** – Admin approves/rejects farmer products
- **Farmer Income Tracking** – Per-order payout tracking

### Admin
- **Dashboard** – User stats, farmer stats, product/order overview
- **Products** – CRUD, categories
- **Product Approvals** – Approve/reject farmer submissions
- **Orders** – View, mark delivered
- **Users** – Manage users and farmers

### UX
- **Responsive Design** – Tailwind CSS, mobile-friendly
- **Inactivity Logout** – Auto-logout after 15 minutes
- **Image Upload** – Cloudinary for product images
- **Toast Notifications** – React Hot Toast

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind CSS, React Hot Toast |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), JWT, Bcrypt, Multer |
| **Database** | MongoDB Atlas |
| **Storage** | Cloudinary (images) |
| **AI** | Groq SDK (LankaNutri Advisor chatbot) |

---

## Project Structure

```
Smart-Diet-SL/
├── Client/                    # React Frontend
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/common/ # Header, Footer, Chatbot, AdminSidebar, FarmerSidebar, etc.
│   │   ├── contexts/         # LanguageContext (EN/SI/TA)
│   │   ├── hooks/            # useInactivityLogout
│   │   ├── pages/
│   │   │   ├── admin/        # Admin dashboard, products, orders, users, approvals
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── calculator/   # Nutrition Calculator
│   │   │   ├── cart/         # Shopping cart
│   │   │   ├── checkout/     # Checkout
│   │   │   ├── diet-planner/ # Diet Planner
│   │   │   ├── diet-plans/   # Diet Plans
│   │   │   ├── farmer/       # Farmer dashboard, products, orders, income
│   │   │   ├── home/         # Homepage
│   │   │   ├── meal-logging/ # Meal Logging
│   │   │   ├── products/     # Products listing & detail
│   │   │   ├── profile/      # Profile
│   │   │   ├── sri-lankan-plates/ # Plate Generator
│   │   │   └── orders/       # Orders & Order Detail
│   │   ├── services/         # API services
│   │   └── store/slices/     # Redux (auth, cart, products, admin, farmer)
│   └── package.json
│
├── Server/                    # Node.js Backend
│   ├── config/               # database.js, cloudinary.js
│   ├── controllers/          # auth, products, orders, chatbot, diet, farmer, admin, etc.
│   ├── data/                 # sampleTraditionalFoods.js (154+ foods, daily tips)
│   ├── middlewares/          # auth.js (protect, admin, farmer)
│   ├── models/               # User, Product, Order, TraditionalFood, DailyTip, etc.
│   ├── routes/               # API route definitions
│   ├── scripts/              # seedData.js, checkEnv.js
│   └── server.js
│
├── package.json              # Root scripts (install:all, dev, build, start)
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Cloudinary](https://cloudinary.com) account (images)
- [Groq](https://console.groq.com) API key (chatbot)

### 1. Clone & Install
```bash
git clone https://github.com/YasiruUpananda/Smart-Diet-SL.git
cd Smart-Diet-SL
npm run install:all
```

### 2. Environment Setup

**Server** – Create `Server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
```

**Client** – Create `Client/.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Traditional Foods & Daily Tips)
```bash
cd Server
npm run seed
```

### 4. Run Development
```bash
# From project root – runs both Client & Server
npm run dev
```

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:5000/api  

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install Client + Server dependencies |
| `npm run dev` | Run Client & Server concurrently |
| `npm run build` | Build Client for production |
| `npm start` | Start Server (production) |
| `npm run seed` | Seed traditional foods & tips (run from `Server/`) |

---

## Environment Variables

### Server (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT tokens |
| `JWT_EXPIRE` | No | Token expiry (default: 7d) |
| `CLOUDINARY_*` | Yes | Cloud name, API key, API secret |
| `GROQ_API_KEY` | Yes | Groq API key for chatbot |
| `GROQ_MODEL` | No | Model (default: llama-3.3-70b-versatile) |
| `CLIENT_URL` | Yes | Frontend URL for CORS |

### Client (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | API URL (default: http://localhost:5000/api) |

---

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register user |
| `POST /api/auth/login` | Login |
| `GET /api/auth/profile` | Get profile (Protected) |
| `GET /api/products` | List products (public) |
| `GET /api/products/:id` | Product detail (public) |
| `GET /api/traditional-foods` | List 154+ traditional foods (public) |
| `POST /api/orders` | Create order (Protected) |
| `GET /api/orders/myorders` | User orders (Protected) |
| `POST /api/chatbot/chat` | Chat with LankaNutri Advisor (public) |
| `GET /api/daily-tips` | Daily tips (public) |
| `GET /api/diet-plans` | Diet plans (public) |
| `GET /api/sri-lankan-plates` | Plate suggestions (public) |
| Farmer & Admin routes | See `Server/routes/` |

---

## User Roles

| Role | Access |
|------|--------|
| **User** | Products, cart, checkout, calculator, diet plans, meal logging, profile, orders |
| **Farmer** | Farmer dashboard, add products, orders, income |
| **Admin** | Admin dashboard, products, approvals, orders, users |

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/login`, `/register` | Auth | Public |
| `/products`, `/products/:id` | Products | Public |
| `/cart`, `/checkout` | Cart & Checkout | Public |
| `/calculator` | Nutrition Calculator | Public |
| `/diet-plans` | Diet Plans | Public |
| `/sri-lankan-plates` | Plate Generator | Public |
| `/diet-planner` | Diet Planner | Protected |
| `/meal-logging` | Meal Logging | Protected |
| `/profile` | Profile | Protected |
| `/orders`, `/orders/:id` | Orders | Protected |
| `/farmer/*` | Farmer dashboard | Farmer |
| `/admin/*` | Admin panel | Admin |

---

## Seed Data

Traditional foods and daily tips are seeded from `Server/data/sampleTraditionalFoods.js`.

To update or re-seed:
1. Edit `Server/data/sampleTraditionalFoods.js`
2. Run: `cd Server && npm run seed`

---

## Deployment

- **Vercel** – Frontend & API (see `VERCEL_SETUP.md`, `VERCEL_ROUTING_FIX.md`)
- **MongoDB Atlas** – Database
- **Cloudinary** – Image storage

---

## Documentation

- `SETUP_GUIDE.md` – Setup
- `ENV_GUIDE.md` – Environment variables
- `SEED_DATA_GUIDE.md` – Seeding data
- `SRI_LANKAN_FEATURES.md` – Sri Lankan features
- `TROUBLESHOOTING.md` – Common issues
- `DEPLOYMENT_GUIDE.md` – Deployment

---

## License

ISC

---

## Author

Smart Diet SL Development Team  
Repository: [github.com/YasiruUpananda/Smart-Diet-SL](https://github.com/YasiruUpananda/Smart-Diet-SL)
