import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getDomain, getDiscountSelector } from '../services/offerChecker';
import connectDB from '../config/database.js';
import StoreCheckerTest from '../models/StoreCheckerTest.js';

await connectDB();

puppeteer.use(StealthPlugin());

const getFirstOfferURL = async (storeUrl, firstItemCode) => {
    console.log(storeUrl)
    console.log(firstItemCode)
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(storeUrl);

    const firstOfferURL = await page.evaluate((firstItemCode) => {
        const element = document.querySelector(firstItemCode);
        return element ? element.href : null;
    }, firstItemCode);
    if (firstOfferURL == null) {
        console.error(`La pagina ${storeUrl} no encuentra la URL del art con el codigo ${firstItemCode}`)
    }
    console.log(firstOfferURL)

    await browser.close();
    return firstOfferURL;
};

const checkOffer = async (firstOfferURL) => {
    console.log(firstOfferURL)
    const pageProduct = getDomain(firstOfferURL);
    const codePage = await getDiscountSelector(pageProduct);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(firstOfferURL);

    const isDiscounted = await page.evaluate((codePage) => {
        const discountElement = document.querySelector(codePage);
        return discountElement !== null;
    }, codePage);

    await browser.close();

    return isDiscounted;
};

let stores;

beforeAll(async () => {
    stores = await StoreCheckerTest.find();
});

test(`Pillar un articulo y comprobar que lo detecta con descuento`, async () => {
    const allDiscounted = true;
    for (const store of stores) {
        console.log(store.storeUrl)
        console.log(store.firstItemCode)

        const firstOfferURL = await getFirstOfferURL(store.storeUrl, store.firstItemCode);
        console.log(firstOfferURL)
        const isDiscounted = await checkOffer(firstOfferURL);

        if (!isDiscounted) {
            allDiscounted = false
        }
    }
    expect(allDiscounted).toBeTruthy();
}, 300000);



// //Test que compruebe se detectan las ofertas de todas las tiendas que controlamos
// //Añadir un producto y correo y comprobar que este en la bd
// //const products = await Product.find();

// //await sendEmail(product.url, product.email);
// //await Product.findByIdAndDelete(product._id);

// //


