import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['vegetables', 'fruits', 'grains', 'proteins', 'dairy', 'spices', 'other'],
    },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 }, // in grams
      carbs: { type: Number, default: 0 }, // in grams
      fat: { type: Number, default: 0 }, // in grams
      fiber: { type: Number, default: 0 }, // in grams
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // keep existing products visible
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

