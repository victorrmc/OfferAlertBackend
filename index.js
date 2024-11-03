import express from 'express';
import { connectDB } from './config/database.js';
import UserProductRoutes from './routes/UserProductRoutes.js';
import DiscountSelectorRoutes from './routes/DiscountSelectorRoutes.js';
import StoreCheckerTestRoutes from './routes/StoreCheckerTestRoutes.js';
import { startOfferChecker } from './services/offerChecker.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use('/api', UserProductRoutes);
app.use('/api', DiscountSelectorRoutes);
app.use('/api/test', StoreCheckerTestRoutes);

startOfferChecker();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});