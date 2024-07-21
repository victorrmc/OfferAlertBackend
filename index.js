import express from 'express';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import { startOfferChecker } from './services/offerChecker.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', offerRoutes);

startOfferChecker();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});