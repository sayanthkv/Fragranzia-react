const express = require("express");
const checkAuth = require("../middleware/authMiddleware");
const {
  register,
  home,
  login,
  getdata,
  updatedata,
  getallusers,
  toggleUserBlockStatus,
} = require("../Controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/home", checkAuth, home);
router.get("/getallusers", getallusers);
router.get("/getData", checkAuth, getdata);
router.put("/updatedata", checkAuth, updatedata);

// ROUTE TO UPDATE USER BLOCK STATUS
router.put("/users/:id/status", toggleUserBlockStatus);

module.exports = router;