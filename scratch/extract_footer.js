const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIndex = html.indexOf('<div class="footer-v6-col donate-col-v6');
if (startIndex !== -1) {
    const endIndex = html.indexOf('<div class="footer-v6-bottom">', startIndex);
    if (endIndex !== -1) {
        console.log(html.substring(startIndex, endIndex));
    }
}
