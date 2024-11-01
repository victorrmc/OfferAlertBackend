import mongoose from 'mongoose';

const userProductSchema = new mongoose.Schema({
  productUrl: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    ref: 'User'
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
});

const UserProduct = mongoose.model('UserProduct', userProductSchema);

export default UserProduct;