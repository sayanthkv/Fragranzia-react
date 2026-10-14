const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { getUser } = require("../Controllers/userController");

const router = express.Router();

// router.post("/register",register);

// router.post("/login", login);

router.get("/getdetails", checkAuth, getUser);

module.exports = router;

