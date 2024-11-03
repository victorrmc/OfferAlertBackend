import { join } from 'path';

/**
 * @type {import("puppeteer").Configuration}
 */
export default {
    // Configura el directorio de caché para Puppeteer en Render
    cacheDirectory: process.env.NODE_ENV === 'production'
        ? join('/opt/render/', '.cache', 'puppeteer')
        : join(process.cwd(), '.cache', 'puppeteer'),
};