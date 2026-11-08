const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export const isZaraUrl = (url) => /(^|\.)zara\.com$/i.test(new URL(url).hostname);

// Zara product URLs look like https://www.zara.com/es/es/nombre-p00840355.html?v1=549089411
// where v1 is the id of the selected colour. Adding ajax=true makes the same
// URL return the product data as JSON (prices in cents).
export const buildZaraJsonUrl = (productUrl) => {
    const url = new URL(productUrl);
    if (!/-p\d+\.html$/i.test(url.pathname)) {
        throw new Error('La URL de Zara no parece la de un producto (debe terminar en -pXXXXXXXX.html)');
    }
    const jsonUrl = new URL(url.origin + url.pathname);
    const v1 = url.searchParams.get('v1');
    if (v1) jsonUrl.searchParams.set('v1', v1);
    jsonUrl.searchParams.set('ajax', 'true');
    return jsonUrl.toString();
};

export const parseZaraProduct = (data, productUrl) => {
    const product = data?.product;
    const colors = product?.detail?.colors;
    if (!product || !Array.isArray(colors) || colors.length === 0) {
        throw new Error('Respuesta de Zara sin datos de producto');
    }

    const v1 = new URL(productUrl).searchParams.get('v1');
    const color = (v1 && colors.find((c) => String(c.productId) === v1)) || colors[0];

    if (typeof color.price !== 'number') {
        throw new Error('Zara no devuelve precio para este producto (puede estar agotado o retirado)');
    }

    const oldPrice = typeof color.oldPrice === 'number' ? color.oldPrice : null;
    const onSale = oldPrice !== null && oldPrice > color.price;

    return {
        store: 'zara',
        name: product.name,
        color: color.name ?? null,
        price: color.price / 100,
        oldPrice: onSale ? oldPrice / 100 : null,
        discountPercentage: onSale
            ? color.displayDiscountPercentage ?? Math.round((1 - color.price / oldPrice) * 100)
            : null,
        onSale,
    };
};

export const getZaraProduct = async (productUrl) => {
    const response = await fetch(buildZaraJsonUrl(productUrl), {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
        throw new Error(`Zara respondió ${response.status}`);
    }
    return parseZaraProduct(await response.json(), productUrl);
};
