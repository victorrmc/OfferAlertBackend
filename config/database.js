import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const getUri = () => {
    if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
    if (process.env.DB_PASSWORD) {
        return `mongodb+srv://serverOfferAlert:${process.env.DB_PASSWORD}@cluster0.1eqfeju.mongodb.net/?retryWrites=true&w=majority`;
    }
    throw new Error('Falta MONGODB_URI (o DB_PASSWORD) en las variables de entorno');
};

async function connectDB() {
    try {
        await mongoose.connect(getUri());
        console.log('Conectado a MongoDB');
        return mongoose.connection;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
}

export { connectDB, mongoose };
