import cron from 'node-cron';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserProduct from '../models/UserProduct.js';
import DiscountSelector from '../models/DiscountSelector.js';
import { sendEmail } from '../utils/emailSender.js';

puppeteer.use(StealthPlugin());

const checkForOffers = async () => {
    console.log('Cron job executed at', new Date().toISOString());
    const products = await UserProduct.find();

    for (const product of products) {
        console.log("Comprobando producto:", product.productUrl);
        try {
            const pageUserProduct = getDomain(product.productUrl)
            console.log("pageUserProduct ", pageUserProduct)
            const codePage = await getDiscountSelector(pageUserProduct)
            if (!codePage) {
                continue
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(product.productUrl);

            const isDiscounted = await page.evaluate((codePage) => {
                const discountElement = document.querySelector(codePage);
                return discountElement !== null;
            }, codePage);

            await browser.close();

            if (isDiscounted) {
                console.log(`Oferta detectada para el producto ${product.productUrl}`);
                await sendEmail(product.productUrl, product.userEmail);
                await UserProduct.findByIdAndDelete(product._id);
                console.log(`UserProducto ${product.productUrl} eliminado de la base de datos`);
            } else {
                console.log(`No se encontró oferta para el producto ${product.productUrl}`);
                product.lastChecked = new Date();
                await product.save();
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            console.error(`Error fetching product: ${product.productUrl}`);
        }
    }
};

export const startOfferChecker = () => {
    cron.schedule('* * * * *', checkForOffers);
};

export const getDomain = (productUrl) => {
    const productUrlObject = new URL(productUrl);
    let hostname = productUrlObject.hostname;
    if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
    }
    return hostname;
}

export const getDiscountSelector = async (domain) => {
    const discountSelector = await DiscountSelector.findOne({ domain });
    console.log("domain ", domain, "discountSelector ", discountSelector)

    if (discountSelector) {
        return discountSelector.selector;
    } else {
        console.log('Clave no encontrada para la pagina', domain)
        return null;
        //eliminar el producto de la bbdd e informar al usuario y a mi por correo.
    }
}