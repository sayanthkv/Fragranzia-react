const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { addAddress,getaddress,updateAddress,primaryaddress,fetchprimary } = require("../Controllers/addressController");

const router = express.Router();

router.post("/saveaddress", checkAuth, addAddress);

router.put("/updateaddress/:id", checkAuth, updateAddress);
router.put("/primaryaddress/:id",checkAuth,primaryaddress);

router.get("/getdata", checkAuth, getaddress);
router.get("/getprimaryaddress",checkAuth,fetchprimary)



module.exports = router;

