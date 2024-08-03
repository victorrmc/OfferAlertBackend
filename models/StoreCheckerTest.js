import mongoose from 'mongoose';

const storeCheckerTestSchema = new mongoose.Schema({
    storeUrl: { type: String, required: true, unique: true },
    firstItemCode: { type: String, required: true }
});

const StoreCheckerTest = mongoose.model('StoreCheckerTest', storeCheckerTestSchema);

export default StoreCheckerTest;