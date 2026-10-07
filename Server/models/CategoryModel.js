const mongoose = require("mongoose");
// const { Variant } = require("./VariantModel");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
    Category: mongoose.model("Category", categorySchema),
};