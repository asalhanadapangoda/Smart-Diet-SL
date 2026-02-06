import mongoose from 'mongoose';

const farmerIncomeSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'paid',
      index: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid duplicate payouts per (farmer, order)
farmerIncomeSchema.index({ farmer: 1, order: 1 }, { unique: true });

const FarmerIncome = mongoose.model('FarmerIncome', farmerIncomeSchema);

export default FarmerIncome;

