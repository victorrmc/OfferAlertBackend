import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { checkDiscound } from '../services/offerChecker';
import connectDB from '../config/database.js';
import StoreCheckerTest from '../models/StoreCheckerTest.js';

await connectDB();

puppeteer.use(StealthPlugin());

const getFirstOfferURL = async (storeUrl, firstItemCode) => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(storeUrl);

    const firstOfferURL = await page.evaluate((firstItemCode) => {
        const element = document.querySelector(firstItemCode);
        return element ? element.href : null;
    }, firstItemCode);
    if (firstOfferURL == null) {
        console.error(`La pagina ${storeUrl} no encuentra la URL del articulo con el codigo ${firstItemCode}`)
    }


    await browser.close();
    return firstOfferURL;
};


let stores;

beforeAll(async () => {
    stores = await StoreCheckerTest.find();
});

test(`Pillar un articulo y comprobar que lo detecta con descuento`, async () => {
    let allDiscounted = true;
    for (const store of stores) {
        const firstOfferURL = await getFirstOfferURL(store.storeUrl, store.firstItemCode);
        if (!firstOfferURL) {
            allDiscounted = false
            continue;
        }
        const isDiscounted = await checkDiscound(firstOfferURL);

        if (!isDiscounted) {
            allDiscounted = false
        } else {
            console.log("La tienda funciona \n", store)
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


