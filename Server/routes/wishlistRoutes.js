
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../Controllers/wishlistController");

router.post("/add/:id", checkAuth, addToWishlist);
router.get("/", checkAuth, getWishlist);
router.delete("/remove/:id", checkAuth, removeFromWishlist);

module.exports = router;
