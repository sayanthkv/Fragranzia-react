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

    for (const item of orderItems) {
      const product = await Products.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${item.product}`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }
    }

    // 2. Prepare Payment & Balance Parameters
    const isCOD = paymentMethod.toLowerCase() === "cod";
    const computedPaymentStatus = paymentStatus || (isCOD ? "Pending" : "Paid");
    const computedBalance = balanceTotal ?? (isCOD ? totalPrice : 0);

    // 3. Create and Save the New Order
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

  
    await Promise.all(
      orderItems.map((item) =>
        Products.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: -item.quantity } }, 
          { new: true }
        )
      )
    );

    // 5. Clear Cart inside User Document
    await User.findByIdAndUpdate(userId, {
      $set: { cart: [], cart_total: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully and product stock updated!",
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
}

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

// 3. User: Get single order details by ID
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

// 4. User: Cancel an order
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

    // 1. Restock the quantities back to each product
    if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
      await Promise.all(
        order.orderItems.map((item) =>
          Products.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: item.quantity } },
            { new: true }
          )
        )
      );
    }

    // 2. Mark order status as Cancelled
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

// 5. Admin: Fetch ALL orders across all users
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

// 6. Admin: Update order delivery status
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

    // Automatically update payment parameters if COD is delivered
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

// User: Request order return
// User: Request order return
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

    if (order.deliveryStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be requested for return.",
      });
    }

    if (order.isReturned || (order.returnStatus && order.returnStatus !== "Requested")) {
      return res.status(400).json({
        success: false,
        message: "A return request has already been submitted for this order.",
      });
    }

    // Update database fields
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

// Export all controller functions cleanly
module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturnOrder
};