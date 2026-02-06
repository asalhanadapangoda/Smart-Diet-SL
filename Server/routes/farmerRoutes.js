import express from 'express';
import { protect, farmer } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import {
  getMyFarmerProducts,
  createFarmerProduct,
  updateMyProductAvailability,
  getMyFarmerOrders,
  getMyFarmerIncome,
} from '../controllers/farmerController.js';

const router = express.Router();

router.use(protect, farmer);

router.route('/products')
  .get(getMyFarmerProducts)
  .post(upload.single('image'), createFarmerProduct);

router.route('/products/:id/availability')
  .put(updateMyProductAvailability);

router.route('/orders')
  .get(getMyFarmerOrders);

router.route('/income')
  .get(getMyFarmerIncome);

export default router;

