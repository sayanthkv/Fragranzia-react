const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { register, home, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register",register);

router.post("/login", login);

router.get("/home", checkAuth, home);

module.exports = router;

