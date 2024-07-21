import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    page: { type: String, required: true, unique: true },
    code: { type: String, required: true }
});

const Offer = mongoose.model('Offer', offerSchema);


export default Offer;