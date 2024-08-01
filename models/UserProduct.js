import mongoose from 'mongoose';

const userProductSchema = new mongoose.Schema({
  productUrl: { type: String, required: true },  // Renombrado desde 'URL'
  userEmail: { type: String, required: true }  // Renombrado desde 'email'
});

const UserProduct = mongoose.model('UserProduct', userProductSchema);

export default UserProduct;