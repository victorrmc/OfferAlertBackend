import mongoose from 'mongoose';

const userProductSchema = new mongoose.Schema({
  productUrl: { type: String, required: true },
  userEmail: { type: String, required: true }
});

const UserProduct = mongoose.model('UserProduct', userProductSchema);

export default UserProduct;