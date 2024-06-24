import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cheerio from 'cheerio';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Mongoose models
import Product from './models/Product.js';

const app = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER_OFERT,
        pass: process.env.EMAIL_KEY_OFERT
    }
});

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/product-tracker').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

app.use(express.json());

// Ruta para añadir productos
app.post('/add-product', async (req, res) => {
    const { url, email } = req.body;
    const product = new Product({ url, email });
    await product.save();
    res.status(201).send(product);
});

// Ruta para obtener productos
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Función para enviar correo
const sendEmail = async (productUrl, userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER_OFERT,
        to: `${userEmail}`,
        subject: 'Oferta Detectada',
        text: `Se ha detectado una oferta en el producto: ${productUrl}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const checkForOffers = async () => {
    console.log('Cron job executed at', new Date().toISOString());
    const products = await Product.find();

    console.log('Productos', products);
    for (const product of products) {
        console.log("Comprobando producto:", product.url);
        try {
            puppeteer.use(StealthPlugin())
            const browser = await puppeteer.launch()
            const page = await browser.newPage();
            await page.goto(product.url);

            const isDiscounted = await page.evaluate(() => {
                const discountElement = document.querySelector('span.MwTOW.BR6YF');
                return discountElement !== null;
            });

            await browser.close();

            if (isDiscounted) {
                console.log(`Oferta detectada para el producto ${product.url}`);
                await sendEmail(product.url, product.email);

                // Eliminar el producto de la base de datos
                await Product.findByIdAndDelete(product._id);
                console.log(`Producto ${product.url} eliminado de la base de datos`);
            } else {
                console.log(`No se encontró oferta para el producto ${product.url}`);
                // Actualizar la fecha de última comprobación
                product.lastChecked = new Date();
                await product.save();
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            console.error(`Error fetching product: ${product.url}`);
        }
    }
};

// Programa la tarea para que se ejecute cada 5 minutos
cron.schedule('0 0 */3 * *', checkForOffers);
ñ