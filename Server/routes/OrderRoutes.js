const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturnOrder,
  processReturnStatusAdmin,
} = require("../Controllers/orderController");

// Protected order routes
router.use(checkAuth);

// 1. User Order Routes
router.post("/placeorder", placeOrder);
router.get("/my-orders", getMyOrders);

// 2. Admin Order Routes (MUST be placed before dynamic /:id)
router.get("/admin/all", getAllOrdersAdmin);
router.put("/admin/status/:id", updateOrderStatusAdmin);
router.put("/admin/return-status/:id", processReturnStatusAdmin);

// 3. Dynamic User ID Routes (Placed at the bottom)
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);
router.put("/return/:id", requestReturnOrder);

module.exports = router;