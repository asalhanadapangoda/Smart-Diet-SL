import express from 'express';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrder,
  getAdminUsers,
  updateUserRole,
  getProductApprovalRequests,
  decideProductApproval,
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

// Product routes
router.route('/products')
  .get(getAdminProducts)
  .post(upload.single('image'), createAdminProduct);

router.route('/products/:id')
  .put(upload.single('image'), updateAdminProduct)
  .delete(deleteAdminProduct);

// Order routes
router.route('/orders')
  .get(getAdminOrders);

router.route('/orders/:id')
  .put(updateAdminOrder);

// User routes
router.route('/users')
  .get(getAdminUsers);

router.route('/users/:id/role')
  .put(updateUserRole);

// Product approval requests
router.route('/product-approvals')
  .get(getProductApprovalRequests);

router.route('/product-approvals/:id')
  .put(decideProductApproval);

export default router;