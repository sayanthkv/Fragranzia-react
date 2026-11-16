const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("WARNING: MONGO_URI is not defined in environment variables. Database not connected.");
      return;
    }
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

module.exports = connectDb;
