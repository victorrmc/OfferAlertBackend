import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  url: { type: String, required: true },
  email: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
