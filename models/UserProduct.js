import mongoose from 'mongoose';

const userProductSchema = new mongoose.Schema({
  productUrl: { type: String, required: true },
  userEmail: { type: String, required: true },
  store: { type: String, default: null },
  name: { type: String, default: null },
  color: { type: String, default: null },
  price: { type: Number, default: null },
  oldPrice: { type: Number, default: null },
  discountPercentage: { type: Number, default: null },
  onSale: { type: Boolean, default: false },
  notifiedAt: { type: Date, default: null },
  notifiedPrice: { type: Number, default: null },
  lastError: { type: String, default: null },
  lastChecked: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

userProductSchema.index({ userEmail: 1, productUrl: 1 }, { unique: true });

const UserProduct = mongoose.model('UserProduct', userProductSchema);

export default UserProduct;
