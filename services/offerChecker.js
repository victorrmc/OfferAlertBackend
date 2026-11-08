import cron from 'node-cron';
import UserProduct from '../models/UserProduct.js';
import { getProductInfo } from './stores/index.js';
import { sendOfferEmail } from '../utils/emailSender.js';

const DELAY_BETWEEN_PRODUCTS_MS = 3000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Updates the stored product with fresh data and sends an email when it is on
 * sale. A product is notified once per sale price: you get another email only
 * if the price drops again, or if it goes back to full price and is reduced later.
 */
export const checkProduct = async (product) => {
    const info = await getProductInfo(product.productUrl);

    product.store = info.store;
    if (info.name) product.name = info.name;
    if (info.color) product.color = info.color;
    product.price = info.price;
    product.oldPrice = info.oldPrice;
    product.discountPercentage = info.discountPercentage;
    product.onSale = info.onSale;
    product.lastChecked = new Date();
    product.lastError = null;

    if (info.onSale) {
        const alreadyNotified =
            product.notifiedAt &&
            (info.price === null || (product.notifiedPrice !== null && info.price >= product.notifiedPrice));
        if (!alreadyNotified) {
            const result = await sendOfferEmail(product);
            if (result.success) {
                product.notifiedAt = new Date();
                product.notifiedPrice = info.price;
            }
        }
    } else {
        product.notifiedAt = null;
        product.notifiedPrice = null;
    }

    await product.save();
    return product;
};

let running = false;

export const checkForOffers = async () => {
    if (running) {
        console.log('La comprobación anterior sigue en marcha, me la salto');
        return;
    }
    running = true;
    console.log('Comprobando ofertas', new Date().toISOString());
    try {
        const products = await UserProduct.find();
        for (const [i, product] of products.entries()) {
            try {
                await checkProduct(product);
                console.log(
                    `${product.onSale ? '🔥 REBAJADO' : 'Sin rebaja'}: ${product.name ?? product.productUrl}` +
                        (product.price !== null ? ` (${product.price} €)` : '')
                );
            } catch (error) {
                console.error(`Error comprobando ${product.productUrl}: ${error.message}`);
                product.lastChecked = new Date();
                product.lastError = error.message;
                await product.save();
            }
            if (i < products.length - 1) await sleep(DELAY_BETWEEN_PRODUCTS_MS);
        }
    } finally {
        running = false;
    }
};

export const startOfferChecker = () => {
    if (process.env.ENABLE_CRON === 'false') {
        console.log('Cron desactivado (ENABLE_CRON=false)');
        return;
    }
    const schedule = process.env.CHECK_CRON || '*/30 * * * *';
    cron.schedule(schedule, checkForOffers);
    console.log(`Comprobación de ofertas programada: ${schedule}`);
};
