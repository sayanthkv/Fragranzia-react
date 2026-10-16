const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const { register, home, login,getdata,updatedata} = require("../Controllers/authController");

const router = express.Router();

router.post("/register",register);

router.post("/login", login);

router.get("/home", checkAuth, home);

router.get('/getData',checkAuth,getdata)

router.put("/updatedata",checkAuth,updatedata)
module.exports = router;

