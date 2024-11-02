import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

if (!process.env.DB_PASSWORD) {
    console.error('Error: No se encontró DB_PASSWORD en las variables de entorno');
    process.exit(1);
}

const uri = `mongodb+srv://serverOfferAlert:${process.env.DB_PASSWORD}@cluster0.1eqfeju.mongodb.net/?retryWrites=true&w=majority`;

async function connectDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("¡Conexión exitosa a MongoDB con Mongoose!");

        return mongoose.connection;
    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1);
    }
}

export { connectDB, mongoose };