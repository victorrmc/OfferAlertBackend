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
            const isDiscounted = await checkDiscound(product.productUrl)
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

export const checkDiscound = async (productURL) => {
    if (!productURL) {
        console.error('Error there is not URL')
        return false
    }
    const domain = getDomainFromURL(productURL)
    const codePage = await getDiscountSelector(domain)
    if (!codePage) {
        console.error('Error searching the code page for the domain of : ' + domain)
        return false;
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productURL);

    const isDiscounted = await page.evaluate((codePage) => {
        const discountElement = document.querySelector(codePage);
        return discountElement !== null;
    }, codePage);

    await browser.close();
    return isDiscounted
}

export const getDomainFromURL = (productUrl) => {
    const productUrlObject = new URL(productUrl);
    let hostname = productUrlObject.hostname;
    if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
    }
    return hostname;
}

export const getDiscountSelector = async (domain) => {
    const discountSelector = await DiscountSelector.findOne({ domain });
    if (discountSelector) {
        return discountSelector.selector;
    } else {
        console.log('Clave no encontrada para la pagina', domain)
        return null;
        //eliminar el producto de la bbdd e informar al usuario y a mi por correo.
    }
}