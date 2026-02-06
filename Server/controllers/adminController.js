import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import FarmerIncome from '../models/FarmerIncome.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
// ============ PRODUCTS ============

// @desc    Get all products (admin - includes unavailable)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
    try {
      // Check if database is connected
      if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected. ReadyState:', mongoose.connection.readyState);
        return res.status(503).json({ 
          message: 'Database not connected',
          error: 'Please wait for database connection'
        });
      }

      const products = await Product.find({}).sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createAdminProduct = async (req, res) => {
    try {
      let imageUrl = req.body.image;
  
      // If file is uploaded, upload to Cloudinary first
      if (req.file && req.file.buffer) {
        try {
          // Check if Cloudinary is configured
          if (!process.env.CLOUDINARY_CLOUD_NAME || 
              !process.env.CLOUDINARY_API_KEY || 
              !process.env.CLOUDINARY_API_SECRET) {
            return res.status(400).json({
              message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
            });
          }
  
          // Upload to Cloudinary
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'smart-diet-sl/products',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            uploadStream.end(req.file.buffer);
          });
  
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          return res.status(500).json({ 
            message: 'Failed to upload image',
            error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          });
        }
      }
  
      // Validate required fields
      if (!req.body.name || !req.body.description || !req.body.price) {
        return res.status(400).json({ message: 'Name, description, and price are required' });
      }
  
      if (!imageUrl) {
        return res.status(400).json({ message: 'Product image is required' });
      }
  
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category || 'other',
        stock: parseInt(req.body.stock) || 0,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
        image: imageUrl,
        approvalStatus: 'approved',
        nutrition: req.body.nutrition ? {
          calories: parseFloat(req.body.nutrition.calories) || 0,
          protein: parseFloat(req.body.nutrition.protein) || 0,
          carbs: parseFloat(req.body.nutrition.carbs) || 0,
          fat: parseFloat(req.body.nutrition.fat) || 0,
          fiber: parseFloat(req.body.nutrition.fiber) || 0,
        } : {},
      });
  
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ 
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateAdminProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      let imageUrl = product.image; // Keep existing image by default
  
      // If new file is uploaded, upload to Cloudinary
      if (req.file && req.file.buffer) {
        try {
          if (!process.env.CLOUDINARY_CLOUD_NAME || 
              !process.env.CLOUDINARY_API_KEY || 
              !process.env.CLOUDINARY_API_SECRET) {
            return res.status(400).json({
              message: 'Cloudinary not configured',
            });
          }
  
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'smart-diet-sl/products',
                resource_type: 'image',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(req.file.buffer);
          });
  
          imageUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          return res.status(500).json({ message: 'Failed to upload image' });
        }
      } else if (req.body.image) {
        // If image URL is provided in body, use it
        imageUrl = req.body.image;
      }
  
      // Update product fields
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? parseFloat(req.body.price) : product.price;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock !== undefined ? parseInt(req.body.stock) : product.stock;
      product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;
      if (req.body.approvalStatus) {
        product.approvalStatus = req.body.approvalStatus;
      }
      product.image = imageUrl;
      
      if (req.body.nutrition) {
        product.nutrition = {
          calories: parseFloat(req.body.nutrition.calories) || product.nutrition?.calories || 0,
          protein: parseFloat(req.body.nutrition.protein) || product.nutrition?.protein || 0,
          carbs: parseFloat(req.body.nutrition.carbs) || product.nutrition?.carbs || 0,
          fat: parseFloat(req.body.nutrition.fat) || product.nutrition?.fat || 0,
          fiber: parseFloat(req.body.nutrition.fiber) || product.nutrition?.fiber || 0,
        };
      }
  
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ ORDERS ============

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateAdminOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.body.status !== undefined) {
        const nextStatus = String(req.body.status).toLowerCase();
        if (!['pending', 'delivering', 'completed'].includes(nextStatus)) {
          return res.status(400).json({ message: 'Invalid order status' });
        }
        order.status = nextStatus;
        if (nextStatus === 'completed') {
          order.isDelivered = true;
          order.deliveredAt = order.deliveredAt || Date.now();
        }
      }
      // Support explicit order status updates (pending | delivering | completed)
      if (req.body.status !== undefined) {
        const nextStatus = String(req.body.status).toLowerCase();
        if (!['pending', 'delivering', 'completed'].includes(nextStatus)) {
          return res.status(400).json({ message: 'Invalid order status' });
        }
        order.status = nextStatus;

        // Keep legacy flags roughly in sync for existing UI
        if (nextStatus === 'completed') {
          order.isDelivered = true;
          order.deliveredAt = order.deliveredAt || Date.now();
        }
      }

      if (req.body.isPaid !== undefined) {
        order.isPaid = req.body.isPaid;
        if (req.body.isPaid) {
          order.paidAt = Date.now();
        }
      }

      if (req.body.isDelivered !== undefined) {
        order.isDelivered = req.body.isDelivered;
        if (req.body.isDelivered) {
          order.deliveredAt = Date.now();
          if (!order.status || order.status !== 'completed') {
            order.status = 'completed';
          }
        }
      }

      // When order is marked completed, create farmer income records (idempotent)
      if (order.status === 'completed') {
        const itemsByFarmer = new Map();
        for (const item of order.orderItems || []) {
          if (!item.farmer) continue;
          const farmerId = item.farmer.toString();
          const lineTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0);
          itemsByFarmer.set(farmerId, (itemsByFarmer.get(farmerId) || 0) + lineTotal);
        }

        for (const [farmerId, amount] of itemsByFarmer.entries()) {
          if (amount <= 0) continue;
          // unique index prevents duplicates; this also keeps safe on retries
          await FarmerIncome.updateOne(
            { farmer: farmerId, order: order._id },
            {
              $setOnInsert: {
                farmer: farmerId,
                order: order._id,
                amount,
                paymentStatus: 'paid',
                paidAt: Date.now(),
              },
            },
            { upsert: true }
          );
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ USERS ============

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // Validate role
    if (!role || !['user', 'farmer', 'admin'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Role must be "user", "farmer", or "admin"' 
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (req.user && req.user._id.toString() === id) {
      return res.status(400).json({ 
        message: 'You cannot change your own role' 
      });
    }

    // Update role
    user.role = role;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============ PRODUCT APPROVALS ============

// @desc    Get pending farmer products
// @route   GET /api/admin/product-approvals
// @access  Private/Admin
export const getProductApprovalRequests = async (req, res) => {
  try {
    const pending = await Product.find({ approvalStatus: 'pending' })
      .populate('farmer', 'name email')
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve or reject a farmer product
// @route   PUT /api/admin/product-approvals/:id
// @access  Private/Admin
export const decideProductApproval = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const action = String(req.body.action || '').toLowerCase();
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    if (action === 'approve') {
      product.approvalStatus = 'approved';
      product.rejectionReason = '';
      // keep availability as-is; farmer/admin can toggle later
    } else {
      product.approvalStatus = 'rejected';
      product.isAvailable = false;
      product.rejectionReason = req.body.rejectionReason ? String(req.body.rejectionReason) : '';
    }

    const saved = await product.save();
    res.json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};