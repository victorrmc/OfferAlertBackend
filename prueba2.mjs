import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({
    headless: false, // Can be set to true for debugging
    slowMo: 250, // Introduce a slight delay (adjust as needed)
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
});
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('https://www.asos.com/es/collusion/americana-de-sastre-caqui-premium-de-collusion-parte-de-un-conjunto/prd/205118128#colourWayId-205118129');

// Set screen size.
await page.setViewport({ width: 1080, height: 1024 });

// Type into search box.
//await page.locator('.devsite-search-field').fill('automate beyond recorder');

// Wait and click on first result.
//await page.locator('.devsite-result-item-link').click();

// Locate the full title with a unique string.
await page.screenshot({ path: 'example.png' })

const data = await page.evaluate(() => {
    // let discounted = document.querySelector('span.MwTOW.BR6YF');
    // let title = document.querySelector('h1.jcdpl');
    let discounted = document.querySelector('span.MwTOW.BR6YF').innerText;
    return {
        discounted,
    }
});
console.log(data);
// Print the full title.
//console.log('The title of this blog post is "%s".', fullTitle);
await browser.close();

return data ? true : false;