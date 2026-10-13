const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1,
      });
    }

    let total = 0;

    for (const item of user.cart) {
      const cartProduct = await Products.findById(item.product);

      if (cartProduct) {
        const price = Number(
          cartProduct.saleprice || cartProduct.price
        );

        total += price * item.quantity;
      }
    }

    user.cart_total = total;

    await user.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart: user.cart,
      cart_total: user.cart_total,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Failed to add product to cart",
    });
  }
};



const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const cartItems = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Products.findById(item.product);

        if (!product) return null;

        return {
          _id: item._id,
          product: product,
          quantity: item.quantity,
          price: Number(product.saleprice || product.price),
        };
      })
    );

    const validCartItems = cartItems.filter(Boolean);

    const cartTotal = validCartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return res.status(200).json({
      cart: validCartItems,
      cart_total: cartTotal,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const itemExists = user.cart.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    // Remove the product from this user's cart
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate the cart total
    let total = 0;

    for (const item of user.cart) {
      const product = await Products.findById(item.product);

      if (product) {
        const price = Number(product.saleprice || product.price);
        total += price * item.quantity;
      }
    }

    user.cart_total = total;

    await user.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart_total: user.cart_total,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);

    return res.status(500).json({
      message: "Failed to remove product from cart",
    });
  }
};




module.exports = {
  addToCart,
  getCart,
  removeFromCart
};