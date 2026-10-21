const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../Controllers/orderController");

// Protected order routes
router.use(checkAuth);

router.post("/placeorder", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/cancel/:id", cancelOrder);

module.exports = router;