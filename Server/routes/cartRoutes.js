const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
   removeFromCart,updateCartQuantity
} = require("../Controllers/cartController");

router.post("/add/:id", checkAuth, addToCart);
router.get("/", checkAuth, getCart);
router.delete("/remove/:id", checkAuth, removeFromCart);
router.put("/update/:id", checkAuth, updateCartQuantity);

module.exports = router;