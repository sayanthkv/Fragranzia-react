const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
   removeFromCart
} = require("../Controllers/cartController");

router.post("/add/:id", checkAuth, addToCart);
router.get("/", checkAuth, getCart);
router.delete("/remove/:id", checkAuth, removeFromCart);

module.exports = router;