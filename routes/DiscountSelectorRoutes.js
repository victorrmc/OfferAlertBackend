import express from 'express';
import { addDiscountSelector, addListDiscountSelector } from '../controllers/DiscountSelectorController.js';

const router = express.Router();

router.post('/add-discount-selector', addDiscountSelector);
router.post('/add-list-discount-selector', addListDiscountSelector);

export default router;