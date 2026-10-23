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
  requestReturnOrder
} = require("../Controllers/orderController");

// Protected order routes
router.use(checkAuth);

// 1. User Order Routes
router.post("/placeorder", placeOrder);
router.get("/my-orders", getMyOrders);

// 2. Admin Order Routes (MUST be placed before /:id)
router.get("/admin/all", getAllOrdersAdmin);
router.put("/admin/status/:id", updateOrderStatusAdmin);

// 3. Dynamic ID Routes (Keep at the bottom)
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);

router.put("/return/:id", requestReturnOrder);


module.exports = router;