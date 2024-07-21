import cron from 'node-cron';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Product from '../models/Product.js';
import Offer from '../models/Offer.js';
import { sendEmail } from '../utils/emailSender.js';

puppeteer.use(StealthPlugin());

const checkForOffers = async () => {
    console.log('Cron job executed at', new Date().toISOString());
    const products = await Product.find();

    for (const product of products) {
        console.log("Comprobando producto:", product.url);
        try {
            const pageProduct = getDomain(product.url)
            const codePage = await getCodePage(pageProduct)
            if (!codePage) {
                continue
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(product.url);

            const isDiscounted = await page.evaluate((codePage) => {
                const discountElement = document.querySelector(codePage);
                return discountElement !== null;
            }, codePage);

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
    cron.schedule('* * * * *', checkForOffers);
};

function getDomain(url) {
    const urlObject = new URL(url);
    let hostname = urlObject.hostname;

    if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
    }

    return hostname;
}

export const getCodePage = async (page) => {
    const offer = await Offer.findOne({ page });
    if (offer) {
        return offer.code;
    } else {
        console.log('Clave no encontrada para la pagina', page)
        return null;
        //eliminar el producto de la bbdd e informar al usuario y a mi por correo.
    }
}