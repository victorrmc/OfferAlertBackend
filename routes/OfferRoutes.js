import express from 'express';
import { addCodePage } from '../controllers/OfferController.js';

const router = express.Router();

router.post('/add-code-page', addCodePage);

export default router;