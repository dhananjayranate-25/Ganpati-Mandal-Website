import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'dhananjayranate@ybl' in html:
    print('UPI ID is present')
else:
    print('UPI ID is MISSING')

if "switchTab('aarti')" in html:
    print('Aarti link in footer is present')
else:
    print('Aarti link is MISSING')

# print footer donate col
m = re.search(r'<div class="footer-v6-col donate-col-v6".*?</div>\s*</div>', html, re.DOTALL)
if m:
    print('Footer donate col:')
    print(m.group(0).encode('ascii', 'ignore').decode('ascii'))
