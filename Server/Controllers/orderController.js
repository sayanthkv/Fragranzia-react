const crypto = require("crypto");
const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");
const razorpay = require("../utils/razorpay");

// Step 1: Create Razorpay Order instance ONLY (No DB document created)
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order.",
      });
    }

    return res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Error in createRazorpayOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while initializing payment gateway.",
      error: error.message,
    });
  }
};

// Step 2: Verify Razorpay Signature & Save Order into MongoDB
const verifyAndPlaceOrder = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User identification missing.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderItems,
      shippingAddress,
      paymentMethod = "online",
      totalPrice,
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided.",
      });
    }

    // Verify HMAC-SHA256 Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    // Stock Check
    for (const item of orderItems) {
      const productId = item.product?._id || item.product;
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${productId}`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}".`,
        });
      }
    }

    // Instantiate and save order
    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      balanceTotal: 0,
      paymentStatus: "Paid",
      paidAt: new Date(),
      deliveryStatus: "Processing",
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      isReturned: false,
      isStockRestored: false,
    });

    const savedOrder = await newOrder.save();

    // Deduct stock
    await Promise.all(
      orderItems.map((item) => {
        const productId = item.product?._id || item.product;
        return Products.findByIdAndUpdate(
          productId,
          { $inc: { quantity: -Number(item.quantity) } },
          { new: true }
        );
      })
    );

    // Clear cart
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [], cart_total: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "Payment verified and order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error in verifyAndPlaceOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving order.",
      error: error.message,
    });
  }
};

// Step 3: Cash On Delivery (COD) Direct Placement
const placeCodOrder = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User identification missing.",
      });
    }

    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided.",
      });
    }

    // Stock Check
    for (const item of orderItems) {
      const productId = item.product?._id || item.product;
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${productId}`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}".`,
        });
      }
    }

    // Save COD order
    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod: "cod",
      totalPrice,
      balanceTotal: totalPrice,
      paymentStatus: "Pending",
      deliveryStatus: "Pending",
      paidAt: null,
      isReturned: false,
      isStockRestored: false,
    });

    const savedOrder = await newOrder.save();

    // Deduct stock
    await Promise.all(
      orderItems.map((item) => {
        const productId = item.product?._id || item.product;
        return Products.findByIdAndUpdate(
          productId,
          { $inc: { quantity: -Number(item.quantity) } },
          { new: true }
        );
      })
    );

    // Clear cart
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [], cart_total: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "Cash on Delivery order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error in placeCodOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while placing COD order.",
      error: error.message,
    });
  }
};

// 4. User: Get all personal orders
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

// 5. User: Get single order details by ID
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

// 6. User: Cancel an order (Stock Restored)
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

    if (order.deliveryStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order has already been cancelled.",
      });
    }

    if (["Shipped", "Out for Delivery", "Delivered"].includes(order.deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order that has already been shipped or delivered.",
      });
    }

    // Restock quantities back to products
    if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
      await Promise.all(
        order.orderItems.map((item) => {
          const productId = item.product?._id || item.product;
          return Products.findByIdAndUpdate(
            productId,
            { $inc: { quantity: Number(item.quantity) } },
            { new: true }
          );
        })
      );
    }

    order.deliveryStatus = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and product stock restored!",
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

// 7. Admin: Fetch ALL orders
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("orderItems.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getAllOrdersAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders.",
      error: error.message,
    });
  }
};

// 8. Admin: Update order delivery status
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.deliveryStatus = status;

    if (status === "Delivered" && order.paymentMethod?.toLowerCase() === "cod") {
      order.paymentStatus = "Paid";
      order.paidAt = new Date();
      order.balanceTotal = 0;
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in updateOrderStatusAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};

// 9. User: Request order return
const requestReturnOrder = async (req, res) => {
  try {
    const userId = req.userId || req.user?._id || req.user?.id;
    const { id } = req.params;
    const { returnReason } = req.body;

    const validReasons = [
      "Damaged Product",
      "Wrong Item Received",
      "Defective Product",
      "Item Not as Described",
      "Size/Color Mismatch",
      "Other",
    ];

    if (!returnReason || !validReasons.includes(returnReason)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid return reason.",
      });
    }

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order.deliveryStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot request a return on a cancelled order.",
      });
    }

    if (order.deliveryStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be requested for return.",
      });
    }

    if (
      order.isReturned ||
      (order.returnStatus &&
        order.returnStatus !== "None" &&
        order.returnStatus !== null)
    ) {
      return res.status(400).json({
        success: false,
        message: "A return request has already been submitted for this order.",
      });
    }

    order.isReturned = true;
    order.returnReason = returnReason;
    order.returnStatus = "Requested";
    order.returnedAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return request submitted successfully.",
      order,
    });
  } catch (error) {
    console.error("Error in requestReturnOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process return request.",
      error: error.message,
    });
  }
};

// 10. Admin: Process return status
const processReturnStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'.",
      });
    }

    const order = await Order.findById(id).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (status === "Approved") {
      const nonRestockableReasons = ["Damaged Product", "Defective Product"];
      const isDamagedOrDefective = nonRestockableReasons.includes(order.returnReason);

      if (!isDamagedOrDefective && !order.isStockRestored && Array.isArray(order.orderItems)) {
        for (const item of order.orderItems) {
          const productId = item.product?._id || item.product;
          const qty = Number(item.quantity || 1);

          if (productId) {
            await Products.findByIdAndUpdate(
              productId,
              { $inc: { quantity: qty } },
              { new: true }
            );
          }
        }
        order.isStockRestored = true;
      }

      order.returnStatus = "Approved";
      order.deliveryStatus = "Returned";
    } else {
      order.returnStatus = "Rejected";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Return request ${status.toLowerCase()} successfully.`,
      order,
    });
  } catch (error) {
    console.error("Error in processReturnStatusAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process return request status.",
      error: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyAndPlaceOrder,
  placeCodOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturnOrder,
  processReturnStatusAdmin,
};