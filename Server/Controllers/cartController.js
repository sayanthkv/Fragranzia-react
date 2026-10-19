const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");


const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;
    const quantity = Number(req.body.quantity ?? 1);

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

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
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

    // Check stock if your product model has a quantity field.
    if (product.quantity !== undefined) {
      const availableStock = Number(product.quantity);

      if (!Number.isFinite(availableStock) || availableStock < 0) {
        return res.status(400).json({
          message: "Invalid product stock",
        });
      }

      const totalRequested =
        quantity + (existingItem ? existingItem.quantity : 0);

      if (totalRequested > availableStock) {
        return res.status(400).json({
          message: `Only ${availableStock} items are available in stock`,
        });
      }
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    let total = 0;

    for (const item of user.cart) {
      const cartProduct = await Products.findById(item.product);

      if (cartProduct) {
        const price = Number(
          cartProduct.saleprice || cartProduct.price || 0
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


const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;
    const quantity = Number(req.body.quantity);

    if (!userId) {
      return res.status(401).json({ message: "Please login first" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check available stock
    if (product.quantity !== undefined && quantity > Number(product.quantity)) {
      return res.status(400).json({
        message: `Only ${product.quantity} items available in stock`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the item quantity directly
    user.cart[itemIndex].quantity = quantity;

    // Recalculate cart total
    let total = 0;
    for (const item of user.cart) {
      const cartProduct = await Products.findById(item.product);
      if (cartProduct) {
        const price = Number(cartProduct.saleprice || cartProduct.price || 0);
        total += price * item.quantity;
      }
    }
    user.cart_total = total;

    await user.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      cart: user.cart,
      cart_total: user.cart_total,
    });
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return res.status(500).json({ message: "Failed to update quantity" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity
};