const mongoose = require('mongoose');
const { Products } = require('../models/productModel');

// Add a new product (Admin)
const addproduct = async (req, res) => {
  try {
    const { name, price, saleprice, quantity, category, description, status } = req.body;

    const imageUrls = req.files && req.files.length > 0 
      ? req.files.map(file => file.path) 
      : [];

    const newProduct = new Products({
      name,
      price,
      saleprice,
      quantity,
      category,
      description,
      status: status || 'Unblock',
      images: imageUrls,
      image: imageUrls[0] || '' // Fallback for components expecting product.image
    });

    await newProduct.save();

    const product = await Products.findById(newProduct._id)
      .populate('category', 'name isActive');

    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch ALL products for Admin panel (Includes Blocked products & Blocked categories)
const getproduct = async (req, res) => {
  try {
    const products = await Products
      .find()
      .populate('category', 'name isActive');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products for admin:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

// Fetch ONLY active products for User store page
// (Filters out blocked products AND products in blocked categories)
const getUserProducts = async (req, res) => {
  try {
    const products = await Products.find({ status: 'Unblock' })
      .populate({
        path: 'category',
        select: 'name isActive'
      });

    // Keep only products whose category exists and is active (isActive === true)
    const activeProducts = products.filter(
      (item) => item.category && item.category.isActive === true
    );

    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Error fetching user products:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      price,
      saleprice,
      quantity,
      category,
      description,
      existingImages
    } = req.body;

    product.name = name;
    product.price = price;
    product.saleprice = saleprice;
    product.quantity = quantity;
    product.category = category;
    product.description = description;

    // Parse existingImages preserved by admin
    let retainedImages = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) {
        retainedImages = existingImages;
      } else {
        try {
          const parsed = JSON.parse(existingImages);
          retainedImages = Array.isArray(parsed) ? parsed : [existingImages];
        } catch {
          retainedImages = [existingImages];
        }
      }
    }

    // New images uploaded via multer
    const newUploadedImages = req.files && req.files.length > 0 
      ? req.files.map((file) => file.path) 
      : [];

    const combinedImages = [...retainedImages, ...newUploadedImages].slice(0, 3);

    if (combinedImages.length === 0) {
      return res.status(400).json({ message: 'A product must have at least 1 image' });
    }

    product.images = combinedImages;
    product.image = combinedImages[0] || ''; // Fallback for single-image references

    await product.save();

    const updatedProduct = await Products.findById(id).populate('category', 'name isActive');
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: error.message || 'Error updating product'
    });
  }
};
// Update product status - Toggle Block/Unblock (Admin)
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    if (!['Block', 'Unblock'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Status must be Block or Unblock.'
      });
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      {
        status
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name isActive');

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product status:', error);

    res.status(500).json({
      message: 'Error updating product status',
      error: error.message
    });
  }
};

// Fetch single product details (Guards against direct URL access for blocked items/categories)
const getitems = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }

    const item = await Products.findById(id).populate('category', 'name isActive');

    if (!item) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Block direct access if product is blocked OR if parent category is blocked/missing
    if (item.status === 'Block' || !item.category || item.category.isActive === false) {
      return res.status(404).json({
        message: 'Product is currently unavailable'
      });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching product:', error);

    res.status(500).json({
      message: 'Error fetching product',
      error: error.message
    });
  }
};

module.exports = {
  addproduct,
  getproduct,
  getUserProducts,
  updateProduct,
  updateProductStatus,
  getitems
};