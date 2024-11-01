import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'plus', 'premium'],
        default: 'free'
    },
    lastCheck: {
        type: Date,
        default: Date.now
    },
    activeProducts: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', userSchema);

export default User;