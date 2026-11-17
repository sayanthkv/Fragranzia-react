# 🌸 Fragranzia — Luxury Perfumes & Fragrances

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)

> A full-stack e-commerce platform for luxury perfumes — featuring a curated product catalog, real-time cart & wishlist, secure authentication, and integrated online payments.

---

## ✨ Features

| Area | Details |
|------|---------|
| 🛍️ **Shop** | Browse products by category, search & filter by name/brand/price |
| 🛒 **Cart & Wishlist** | Add/remove items, quantity management, wishlist sync |
| 🔐 **Authentication** | Email/password signup+login, Google OAuth (one-tap), JWT sessions |
| 💳 **Payments** | Razorpay online payment gateway + Cash on Delivery |
| 📦 **Orders** | Full order lifecycle — place, track, cancel, admin status update |
| 🧑‍💼 **Admin Dashboard** | Manage products, categories, users, and orders via a dedicated admin panel |
| ☁️ **Image Uploads** | Product images hosted on Cloudinary |
| 📱 **Responsive UI** | Mobile-first design built with Bootstrap 5 & React-Bootstrap |

---

## 🛠️ Tech Stack

### Frontend (`Client/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 5 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Bootstrap 5 + React-Bootstrap | 5 / 2.x | Component library & styling |
| React Hot Toast | 2.x | Toast notifications |
| Google OAuth (`@react-oauth/google`) | — | Google sign-in |

### Backend (`Server/`)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18 | Runtime |
| Express | 5 | Web framework |
| MongoDB + Mongoose | 8.x | Database & ODM |
| Cloudinary + Multer | 2.x | Image storage & upload |
| Razorpay | 2.x | Payment gateway |
| JSON Web Token (JWT) | — | Auth tokens |
| bcryptjs | — | Password hashing |
| Google Auth Library | — | Google OAuth verification |

---

## 📁 Project Structure

```
Fragranzia react/
├── Client/                   # Vite + React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/           # Static images / icons
│   │   ├── Components/       # Reusable UI components (Navbar, Footer, Cards…)
│   │   ├── pages/
│   │   │   ├── user/         # Home, Products, Product Detail, Cart, Wishlist, Orders…
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── services/         # Axios API service functions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context providers
│   │   ├── Axios.jsx         # Axios instance with base URL config
│   │   └── App.jsx           # Routes & app entry
│   ├── index.html
│   ├── package.json
│   └── vercel.json           # Vercel SPA rewrite rules
│
├── Server/                   # Express + MongoDB backend
│   ├── Config/               # DB, Cloudinary config
│   ├── Controllers/          # Route handler logic
│   ├── middleware/           # Auth, role guards
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── utils/                # Razorpay, helpers
│   ├── index.js              # Server entry point
│   └── package.json
│
├── render.yaml               # Render deployment blueprint
├── vercel.json               # Vercel root config
├── .gitignore
└── README.md
```

---

## ⚡ Local Setup

### Prerequisites
- Node.js **≥ 18**
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (test keys work fine)
- Google OAuth Client ID (optional for Google sign-in)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/fragranzia.git
cd fragranzia
```

### 2. Install dependencies

```bash
# Frontend
cd Client
npm install

# Backend
cd ../Server
npm install
```

### 3. Configure environment variables

**Server — create `Server/.env`:**

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fragranzia
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_URL=http://localhost:5173
```

**Client — create `Client/.env`:**

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4. Run the development servers

```bash
# Terminal 1 — Backend
cd Server
npm run dev

# Terminal 2 — Frontend
cd Client
npm run dev
```

Frontend runs at **http://localhost:5173** · Backend runs at **http://localhost:5000**

---

## 🚀 Deployment

### Backend → Render

1. Connect your GitHub repo to [Render](https://render.com)
2. Create a new **Web Service** with:
   - **Root Directory:** `Server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add all `Server/.env` variables in Render's **Environment** tab
4. Deploy — Render auto-detects Node ≥ 18

> The included `render.yaml` can also be used as a Blueprint for one-click setup.

### Frontend → Vercel

1. Import the repo into [Vercel](https://vercel.com)
2. Set **Framework Preset** to **Vite**, **Root Directory** to `Client`
3. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `VITE_BACKEND_URL` | `https://your-render-service.onrender.com` |
   | `VITE_GOOGLE_CLIENT_ID` | `your_google_client_id` |
   | `VITE_RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxx` |
4. Deploy — `vercel.json` SPA rewrites are already configured

---

## 🔑 Environment Variables Reference

### Server

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: `5000`) |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay key secret |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `CLIENT_URL` | Optional | Frontend origin for CORS (default: `*`) |

### Client

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACKEND_URL` | ✅ | Full URL of the deployed backend |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `VITE_RAZORPAY_KEY_ID` | Optional | Razorpay public key (for checkout) |

---



## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ · <strong>Fragranzia</strong> — Where Every Scent Tells a Story
</div>
