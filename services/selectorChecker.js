import DiscountSelector from '../models/DiscountSelector.js';

// Generic check: open the page with Puppeteer and look for a CSS selector that
// only exists when the product is discounted. Puppeteer is imported lazily so
// stores that do not need a browser (Zara) work without Chrome installed.
let puppeteerPromise;
const getPuppeteer = () => {
    if (!puppeteerPromise) {
        puppeteerPromise = (async () => {
            const { default: puppeteer } = await import('puppeteer-extra');
            const { default: StealthPlugin } = await import('puppeteer-extra-plugin-stealth');
            puppeteer.use(StealthPlugin());
            return puppeteer;
        })();
    }
    return puppeteerPromise;
};

export const getDomainFromURL = (productUrl) => {
    let hostname = new URL(productUrl).hostname;
    if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
    }
    return hostname;
};

export const getDiscountSelector = async (domain) => {
    const discountSelector = await DiscountSelector.findOne({ domain });
    return discountSelector ? discountSelector.selector : null;
};

export const checkDiscound = async (productURL) => {
    if (!productURL) {
        throw new Error('No hay URL');
    }
    const domain = getDomainFromURL(productURL);
    const selector = await getDiscountSelector(domain);
    if (!selector) {
        throw new Error(`No hay selector de descuento guardado para ${domain}`);
    }

    const puppeteer = await getPuppeteer();
    const launchOptions = process.env.EXECUTABLE_PATH
        ? { executablePath: process.env.EXECUTABLE_PATH }
        : {};
    const browser = await puppeteer.launch(launchOptions);
    try {
        const page = await browser.newPage();
        await page.goto(productURL, { waitUntil: 'networkidle2', timeout: 60000 });
        return await page.evaluate((sel) => document.querySelector(sel) !== null, selector);
    } finally {
        await browser.close();
    }
};
