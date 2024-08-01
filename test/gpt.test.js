import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { getDomain, getDiscountSelector } from '../services/offerChecker'
import connectDB from '../config/database.js';
connectDB();

puppeteer.use(StealthPlugin());

const getFirstOfferURLASOS = async (URL, pageCode) => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.asos.com/women/sale/cat/?cid=7046');

    const firstOfferURL = await page.evaluate(() => {
        const element = document.querySelector('article.productTile_U0clN').firstElementChild;
        return element ? element.href : null;
    });

    await browser.close();
    return firstOfferURL;
};


const checkOffer = async (firstOfferURL) => {
    const pageProduct = getDomain(firstOfferURL)
    const codePage = await getDiscountSelector(pageProduct)
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(firstOfferURL);

    const isDiscounted = await page.evaluate((codePage) => {
        const discountElement = document.querySelector(codePage);
        return discountElement !== null;
    }, codePage);

    await browser.close();

    return isDiscounted
};


test('Pillar un articulo de ASOS sale y comprobar que lo detecta con descuento', async () => {
    const firstOfferURL = await getFirstOfferURLASOS()
    const isDiscounted = await checkOffer(firstOfferURL);
    expect(isDiscounted).toBeTruthy();
}, 30000);

// test('Pillar un articulo de BSTN sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de ZARA sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de AMAZON sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de SVD sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de PC COMPONENTES sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de CARREFOUR  sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de MEDIA MARKT  sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// test('Pillar un articulo de CORTE INGLES  sale y comprobar que lo detecta con descuento', async () => {
//     const firstOfferURL = await getFirstOfferURLASOS()
//     const isDiscounted = await checkOffer(firstOfferURL);
//     expect(isDiscounted).toBeTruthy();
// }, 30000);

// //Test que compruebe se detectan las ofertas de todas las tiendas que controlamos
// //Añadir un producto y correo y comprobar que este en la bd
// //const products = await Product.find();

// //await sendEmail(product.url, product.email);
// //await Product.findByIdAndDelete(product._id);

// //


