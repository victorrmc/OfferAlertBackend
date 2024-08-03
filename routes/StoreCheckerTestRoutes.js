import express from 'express';
import { addStoreCheckerTest, getStoreCheckerTests } from '../controllers/storeCheckerTestController.js';

const router = express.Router();

router.post('/add-store-checker-test', addStoreCheckerTest);
router.get('/store-checker-tests', getStoreCheckerTests);

export default router;