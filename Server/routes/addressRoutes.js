const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { addAddress,getaddress } = require("../Controllers/addressController");

const router = express.Router();

router.post("/saveaddress", checkAuth, addAddress);

// router.post("/login", login);

router.get("/getdata", checkAuth, getaddress);

module.exports = router;

