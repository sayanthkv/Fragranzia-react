// routes/productsRoutes.js
const express = require('express');
const upload = require('../middleware/upload.js'); 

const {
  addproduct,
  getproduct,
  getUserProducts,
  updateProduct,
  updateProductStatus,
  getitems
} = require('../Controllers/productControllers.js');

const router = express.Router();

router.get('/', getUserProducts);
router.get('/admin/all', getproduct);
router.get('/:id', getitems);

router.post('/', upload.array('images', 3), addproduct);
router.put('/:id', upload.array('images', 3), updateProduct);
router.put('/:id/status', updateProductStatus);

module.exports = router;