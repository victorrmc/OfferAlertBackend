import express from 'express';
import { addUserProduct, getUsersProducts } from '../controllers/UserProductController.js';

const router = express.Router();

router.post('/add-user-product', addUserProduct);
router.get('/users-products', getUsersProducts);

export default router;