import { readFileSync } from 'fs';
import { buildZaraJsonUrl, parseZaraProduct } from '../services/stores/zara.js';
import { isSupportedUrl } from '../services/stores/index.js';

const onSale = JSON.parse(readFileSync(new URL('./fixtures/zara-product-on-sale.json', import.meta.url)));
const URL_ON_SALE = 'https://www.zara.com/es/es/jeans-straight-barrel-fit-p00840355.html?v1=549089409';

test('builds the JSON url keeping the colour', () => {
    expect(buildZaraJsonUrl(URL_ON_SALE + '&utm_source=x')).toBe(
        'https://www.zara.com/es/es/jeans-straight-barrel-fit-p00840355.html?v1=549089409&ajax=true'
    );
});

test('rejects urls that are not products', () => {
    expect(() => buildZaraJsonUrl('https://www.zara.com/es/es/hombre-l534.html')).toThrow();
});

test('detects a discounted product and picks the colour from v1', () => {
    expect(parseZaraProduct(onSale, URL_ON_SALE)).toEqual({
        store: 'zara',
        name: 'JEANS STRAIGHT BARREL FIT',
        color: 'Azul',
        price: 19.99,
        oldPrice: 35.95,
        discountPercentage: 49,
        onSale: true,
    });
});

test('a product without oldPrice is not on sale', () => {
    const data = { product: { name: 'CAMISA', detail: { colors: [{ productId: 1, name: 'Azul', price: 3995 }] } } };
    const info = parseZaraProduct(data, 'https://www.zara.com/es/es/camisa-p04470312.html');
    expect(info.onSale).toBe(false);
    expect(info.price).toBe(39.95);
    expect(info.oldPrice).toBeNull();
});

test('only the three stores are supported', () => {
    expect(isSupportedUrl(URL_ON_SALE)).toBe(true);
    expect(isSupportedUrl('https://www.pullandbear.com/es/x-l0123.html')).toBe(true);
    expect(isSupportedUrl('https://www.bershka.com/es/x-c0p123.html')).toBe(true);
    expect(isSupportedUrl('https://www.amazon.es/x')).toBe(false);
    expect(isSupportedUrl('not a url')).toBe(false);
});
