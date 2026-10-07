const express = require("express");
const { addCategory,getCategory,updateCategoryStatus,editCategory } = require("../Controllers/categoryControllers.js");

const router = express.Router();


router.get('/' , getCategory)
router.post('/', addCategory)
router.put("/:id/status", updateCategoryStatus);
router.put("/:id/editdetails", editCategory);
module.exports = router;