import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadBufferToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result?.secure_url || '');
      }
    );

    uploadStream.end(file.buffer);
  });

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const approvalFilter = {
      $or: [{ approvalStatus: 'approved' }, { approvalStatus: { $exists: false } }],
    };
    const query = {
      isAvailable: true,
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$and = [
        approvalFilter,
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    } else {
      Object.assign(query, approvalFilter);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Only approved products are public
      if (product.approvalStatus && product.approvalStatus !== 'approved') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    if (req.file) {
      if (!hasCloudinaryConfig) {
        return res.status(400).json({
          message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
        });
      }
      imageUrl = await uploadBufferToCloudinary(req.file, 'smart-diet-sl/products');
    }

    const product = new Product({
      ...req.body,
      image: imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
      product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;
      
      if (req.body.nutrition) {
        product.nutrition = { ...product.nutrition, ...req.body.nutrition };
      }

      if (req.file) {
        if (!hasCloudinaryConfig) {
          return res.status(400).json({
            message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
          });
        }
        product.image = await uploadBufferToCloudinary(req.file, 'smart-diet-sl/products');
      } else if (req.body.image) {
        product.image = req.body.image;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
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

