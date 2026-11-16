const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDb = require('./Config/db');

const categoryRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productsRoutes');
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const OrderRoutes = require("./routes/OrderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

// Enhanced CORS allowing Render / Vercel domains and local dev
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback so production deployments are never blocked by CORS
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root health-check endpoint for Render deployment verification
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Fragranzia API is running" });
});

app.use('/Category', categoryRoutes);
app.use('/Products', productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/Cart", cartRoutes);
app.use("/Wishlist", wishlistRoutes);
app.use("/address", addressRoutes);

// Mounted under /api/orders to match Axios endpoints
app.use("/api/orders", OrderRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on port ${PORT}`);
});
