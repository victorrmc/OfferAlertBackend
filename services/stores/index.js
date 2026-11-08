import { getZaraProduct, isZaraUrl } from './zara.js';
import { checkDiscound, getDomainFromURL } from '../selectorChecker.js';

export const SUPPORTED_STORES = ['zara.com', 'pullandbear.com', 'bershka.com'];

export const isSupportedUrl = (url) => {
    try {
        const domain = getDomainFromURL(url);
        return SUPPORTED_STORES.some((store) => domain === store || domain.endsWith('.' + store));
    } catch {
        return false;
    }
};

/**
 * Returns { store, name, color, price, oldPrice, discountPercentage, onSale }.
 * Prices are in euros, or null when the store does not expose them.
 */
export const getProductInfo = async (url) => {
    if (isZaraUrl(url)) {
        return getZaraProduct(url);
    }

    // Pull&Bear and Bershka: fall back to the CSS selector check with Puppeteer
    // (needs a DiscountSelector stored for the domain).
    const onSale = await checkDiscound(url);
    return {
        store: getDomainFromURL(url),
        name: null,
        color: null,
        price: null,
        oldPrice: null,
        discountPercentage: null,
        onSale,
    };
};
