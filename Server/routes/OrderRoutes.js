const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const {
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
} = require("../Controllers/orderController");

// Protect all order routes
router.use(checkAuth);

// 1. Payment & Checkout Initiation
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-order", verifyAndPlaceOrder);
router.post("/place-cod", placeCodOrder);

// 2. User Order Routes
router.get("/my-orders", getMyOrders);

// 3. Admin Order Routes (Defined before dynamic /:id)
router.get("/admin/all", getAllOrdersAdmin);
router.put("/admin/status/:id", updateOrderStatusAdmin);
router.put("/admin/return-status/:id", processReturnStatusAdmin);

// 4. Dynamic User Routes
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);
router.put("/return/:id", requestReturnOrder);

module.exports = router;