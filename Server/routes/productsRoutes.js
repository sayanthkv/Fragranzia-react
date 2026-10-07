const express = require('express');
const upload = require('../middleware/upload');

const {
  addproduct,
  getproduct,
  updateProduct,
  updateProductStatus,
  getitems
} = require('../Controllers/productControllers.js');

const router = express.Router();

router.get('/', getproduct);

router.get('/:id', getitems)

router.post('/', upload.single('image'), addproduct);

router.put('/:id', upload.single('image'), updateProduct);

router.put('/:id/status', updateProductStatus);


module.exports = router;
