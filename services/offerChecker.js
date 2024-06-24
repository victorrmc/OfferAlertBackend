import cron from 'node-cron';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Product from '../models/Product.js';
import { sendEmail } from '../utils/emailSender.js';

puppeteer.use(StealthPlugin());

const checkForOffers = async () => {
    console.log('Cron job executed at', new Date().toISOString());
    const products = await Product.find();

    for (const product of products) {
        console.log("Comprobando producto:", product.url);
        try {
            const browser = await puppeteer.launch();
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
                await Product.findByIdAndDelete(product._id);
                console.log(`Producto ${product.url} eliminado de la base de datos`);
            } else {
                console.log(`No se encontró oferta para el producto ${product.url}`);
                product.lastChecked = new Date();
                await product.save();
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            console.error(`Error fetching product: ${product.url}`);
        }
    }
};

export const startOfferChecker = () => {
    cron.schedule('*/5 * * * *', checkForOffers);
};