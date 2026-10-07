const mongoose = require('mongoose');
const { Category } = require('../models/CategoryModel');

const addCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      isActive
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: 'Name and description are required'
      });
    }

    const newCategory = new Category({
      name,
      description,
      isActive:
        typeof isActive === 'boolean'
          ? isActive
          : true
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('ADD CATEGORY ERROR:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error('GET CATEGORY ERROR:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid category ID'
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    category.isActive = !category.isActive;

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Invalid category ID'
      });
    }

    if (!name || !description) {
      return res.status(400).json({
        message: 'Name and description are required'
      });
    }

    const updatedCategory =
      await Category.findByIdAndUpdate(
        id,
        {
          name,
          description
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedCategory) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('EDIT DETAILS ERROR:', error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addCategory,
  getCategory,
  updateCategoryStatus,
  editCategory
};