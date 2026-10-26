const express = require('express');
const upload = require('../middleware/upload');

const {
  addproduct,
  getproduct,
  getUserProducts, // Import the new user filtering method
  updateProduct,
  updateProductStatus,
  getitems
} = require('../Controllers/productControllers.js');

const router = express.Router();

// User Route -> Returns ONLY unblocked products (status: 'Unblock')
router.get('/', getUserProducts);

// Admin Route -> Returns ALL products (both Block and Unblock)
router.get('/admin/all', getproduct);

// Single Product Details Route
router.get('/:id', getitems);

// Product Mutation Routes
router.post('/', upload.single('image'), addproduct);
router.put('/:id', upload.single('image'), updateProduct);
router.put('/:id/status', updateProductStatus);

module.exports = router;