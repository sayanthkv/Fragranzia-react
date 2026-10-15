const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { addAddress,getaddress,updateAddress } = require("../Controllers/addressController");

const router = express.Router();

router.post("/saveaddress", checkAuth, addAddress);

router.put("/updateaddress/:id", checkAuth, updateAddress);

router.get("/getdata", checkAuth, getaddress);

module.exports = router;

