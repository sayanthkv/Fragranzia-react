const { Order } = require("../models/Order");
const { User } = require("../models/User");
const { Products } = require("../models/productModel");

// 1. User: Place a new order (Stock Decremented)
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

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided in order.",
      });
    }

    // Step 1: Stock Check — Ensure all requested items are in stock
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
          message: `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }
    }

    const isCOD = paymentMethod.toLowerCase() === "cod";
    const computedPaymentStatus = paymentStatus || (isCOD ? "Pending" : "Paid");
    const computedBalance = balanceTotal ?? (isCOD ? totalPrice : 0);

    // Step 2: Instantiate new order
    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      balanceTotal: computedBalance,
      paymentStatus: computedPaymentStatus,
      paidAt: isCOD ? null : new Date(),
      isReturned: false,
      isStockRestored: false,
      returnReason: null,
      returnStatus: null,
    });

    const savedOrder = await newOrder.save();

    // Step 3: Decrement Inventory — Deduct purchased quantities from product stock
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

    // Step 4: Clear User's Cart
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
};

// 2. User: Get all personal orders
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

// 4. User: Cancel an order (Stock Restored)
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

    // Update delivery status
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

// 7. User: Request order return
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

    // Update return fields together
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

// 8. Admin: Approve or Reject Return Request (Conditional Stock Restoration)
const processReturnStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects "Approved" or "Rejected"

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

      // Restock ONLY if reason is NOT Damaged or Defective AND stock has not yet been restored
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

    const isDamagedOrDefective = ["Damaged Product", "Defective Product"].includes(order.returnReason);

    return res.status(200).json({
      success: true,
      message: `Return request ${status.toLowerCase()} successfully.${
        status === "Approved"
          ? isDamagedOrDefective
            ? " Stock was NOT restored because the item was damaged/defective."
            : " Stock HAS been restored to product inventory."
          : ""
      }`,
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
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturnOrder,
  processReturnStatusAdmin,
};