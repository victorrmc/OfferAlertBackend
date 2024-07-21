import express from 'express';
import { addProduct, getProducts } from '../controllers/ProductController.js';

const router = express.Router();

router.post('/add-product', addProduct);
router.get('/products', getProducts);

export default router;