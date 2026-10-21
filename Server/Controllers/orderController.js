const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");

const placeOrder = async (req, res) => {
  try {
    
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User identification missing.",
      });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      balanceTotal,
      paymentStatus,
    } = req.body;

  
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided in order.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    const isCOD = paymentMethod.toLowerCase() === "cod";
    const computedPaymentStatus =
      paymentStatus || (isCOD ? "Pending" : "Paid");
    const computedBalance = balanceTotal ?? (isCOD ? totalPrice : 0);

    
    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      balanceTotal: computedBalance,
      paymentStatus: computedPaymentStatus,
      paidAt: isCOD ? null : new Date(),
    });

    const savedOrder = await newOrder.save();

    // Clear cart and reset cart total inside the User document
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [], cart_total: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while placing order.",
      error: error.message,
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
      error: error.message,
    });
  }
};


const getOrderById = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    })
      .populate("orderItems.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
      error: error.message,
    });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

   
    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order that has already been shipped or delivered.",
      });
    }

    order.deliveryStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
      error: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};