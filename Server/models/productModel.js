const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    saleprice: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['Block', 'Unblock'],
      default: 'Unblock'
    },
    image:{
      type:String,
      required:true

    }
    


  },
  {
    timestamps: true
  }
);

module.exports = {
  Products: mongoose.model('Products', productSchema)
};