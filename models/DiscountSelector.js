import mongoose from 'mongoose';

const discountSelectorSchema = new mongoose.Schema({
    domain: { type: String, required: true, unique: true },  // Renombrado desde 'page'
    selector: { type: String, required: true }  // Renombrado desde 'code'
});

const DiscountSelector = mongoose.model('DiscountSelector', discountSelectorSchema);

export default DiscountSelector;