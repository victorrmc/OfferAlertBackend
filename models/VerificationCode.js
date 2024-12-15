import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for email and code for faster lookups
verificationCodeSchema.index({ email: 1, code: 1 });

// Add method to check if code is expired
verificationCodeSchema.methods.isExpired = function () {
    return new Date() > this.expiresAt;
};

// Add method to check if attempts exceeded
verificationCodeSchema.methods.hasExceededAttempts = function () {
    return this.attempts >= 3;
};

// Automatically clean up expired codes
verificationCodeSchema.statics.cleanupExpired = async function () {
    await this.deleteMany({ expiresAt: { $lt: new Date() } });
};

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

// Run cleanup every hour
setInterval(() => {
    VerificationCode.cleanupExpired();
}, 3600000);

export default VerificationCode;