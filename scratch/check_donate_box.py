import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<div id="donationSection".*?(?=<div id="committeeSection")', text, re.DOTALL)
if m:
    s = m.group(0)
    print('donation-box found:', 'donation-box' in s)
    print('donation-poster found:', 'donation-poster' in s)
