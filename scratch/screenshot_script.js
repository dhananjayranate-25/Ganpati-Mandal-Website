const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/../index.html');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'scratch/screenshot_fixed.png' });
    await browser.close();
})();
