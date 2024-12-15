import express from 'express';
import { sendVerificationCode, verifyCode } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/auth/send-code', sendVerificationCode);
router.post('/auth/verify-code', verifyCode);

export default router;