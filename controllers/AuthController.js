import { Resend } from 'resend';
import VerificationCode from '../models/VerificationCode.js';
import dotenv from 'dotenv';

dotenv.config();
const resend = new Resend(process.env.API_KEY_RESEND);

export const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiration to 5 minutes from now
        const expiresAt = new Date(Date.now() + 5 * 60000);

        // Delete any existing codes for this email
        await VerificationCode.deleteMany({ email });

        // Create new verification code
        const verificationCode = new VerificationCode({
            email,
            code,
            expiresAt
        });

        await verificationCode.save();

        // Send email using Resend
        await resend.emails.send({
            from: 'OfferAlert <onboarding@resend.dev>',
            to: email,
            subject: 'Your Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Your Verification Code</h2>
                    <p>Please use the following code to verify your email address:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; color: #f97316;">${code}</h1>
                    <p>This code will expire in 5 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </div>
            `
        });

        res.status(200).json({
            message: 'Verification code sent successfully',
            expiresAt
        });

    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
};

export const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const verificationCode = await VerificationCode.findOne({ email });

        if (!verificationCode) {
            return res.status(404).json({ error: 'No verification code found' });
        }

        if (verificationCode.isExpired()) {
            await VerificationCode.deleteOne({ _id: verificationCode._id });
            return res.status(400).json({ error: 'Code has expired' });
        }

        if (verificationCode.hasExceededAttempts()) {
            await VerificationCode.deleteOne({ _id: verificationCode._id });
            return res.status(400).json({ error: 'Too many attempts' });
        }

        if (verificationCode.code !== code) {
            verificationCode.attempts += 1;
            await verificationCode.save();
            return res.status(400).json({
                error: 'Invalid code',
                attemptsLeft: 3 - verificationCode.attempts
            });
        }

        // Code is valid - delete it and return success
        await VerificationCode.deleteOne({ _id: verificationCode._id });

        res.status(200).json({
            message: 'Email verified successfully',
            email: verificationCode.email
        });

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
};