
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      return res.status(200).json({
        message: "Product is already in your wishlist",
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      message: "Product added to wishlist successfully",
    });
  } catch (error) {
    console.error("Add to wishlist error:", error.message);

    return res.status(500).json({
      message: "Failed to add product to wishlist",
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const products = await Products.find({
      _id: { $in: user.wishlist },
    });

    const wishlist = products.map((product) => {
      const price = Number(product.saleprice || product.price || 0);
      const originalPrice = Number(product.price || 0);

      return {
        id: product._id.toString(),
        productId: product._id.toString(),
        title: product.name || product.title || "Fragrance",
        image: product.image
          ? `http://localhost:5000/uploads/${product.image}`
          : "",
        alt: product.name || product.title || "Fragrance",
        price,
        originalPrice,
        discountPercent:
          originalPrice > price
            ? Math.round(
                ((originalPrice - price) / originalPrice) * 100
              )
            : 0,
      };
    });

    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Get wishlist error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
};



const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!exists) {
      return res.status(404).json({
        message: "Product not found in wishlist",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error.message);

    return res.status(500).json({
      message: "Failed to remove product from wishlist",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};
