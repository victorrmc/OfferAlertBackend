import mongoose from 'mongoose';

const discountSelectorSchema = new mongoose.Schema({
    domain: { type: String, required: true, unique: true },
    selector: { type: String, required: true }
});

const DiscountSelector = mongoose.model('DiscountSelector', discountSelectorSchema);

export default DiscountSelector;