require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./Config/db');

const categoryRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productsRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use('/Category', categoryRoutes);
app.use('/Products', productsRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});