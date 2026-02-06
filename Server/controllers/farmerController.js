import Product from '../models/Product.js';
import Order from '../models/Order.js';
import FarmerIncome from '../models/FarmerIncome.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get my (farmer) products
// @route   GET /api/farmer/products
// @access  Private/Farmer
export const getMyFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product (pending approval)
// @route   POST /api/farmer/products
// @access  Private/Farmer
export const createFarmerProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    if (req.file && req.file.buffer) {
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        return res.status(400).json({
          message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
        });
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'smart-diet-sl/products', resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.status(400).json({ message: 'Name, description, and price are required' });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      farmer: req.user._id,
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category || 'other',
      stock: parseInt(req.body.stock) || 0,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
      image: imageUrl,
      approvalStatus: 'pending',
      nutrition: req.body.nutrition
        ? {
            calories: parseFloat(req.body.nutrition.calories) || 0,
            protein: parseFloat(req.body.nutrition.protein) || 0,
            carbs: parseFloat(req.body.nutrition.carbs) || 0,
            fat: parseFloat(req.body.nutrition.fat) || 0,
            fiber: parseFloat(req.body.nutrition.fiber) || 0,
          }
        : {},
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Toggle availability of my product
// @route   PUT /api/farmer/products/:id/availability
// @access  Private/Farmer
export const updateMyProductAvailability = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.body.isAvailable === undefined) {
      return res.status(400).json({ message: 'isAvailable is required' });
    }
    product.isAvailable = Boolean(req.body.isAvailable);
    const saved = await product.save();
    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get orders that include my products
// @route   GET /api/farmer/orders
// @access  Private/Farmer
export const getMyFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'orderItems.farmer': req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my income summary (completed orders payouts)
// @route   GET /api/farmer/income
// @access  Private/Farmer
export const getMyFarmerIncome = async (req, res) => {
  try {
    const payouts = await FarmerIncome.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    const totalIncome = payouts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    res.json({ totalIncome, payouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

