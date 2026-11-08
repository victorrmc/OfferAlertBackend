import express from 'express';
import {
    addUserProduct,
    checkNow,
    deleteUserProduct,
    getUsersProducts,
} from '../controllers/UserProductController.js';

const router = express.Router();

router.post('/add-product', addUserProduct); // used by the mobile app
router.post('/add-user-product', addUserProduct);
router.get('/products', getUsersProducts); // ?email=you@example.com
router.get('/users-products', getUsersProducts);
router.delete('/products/:id', deleteUserProduct);
router.post('/check-now', checkNow);

export default router;
