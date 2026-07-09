import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<div class="footer-v6-col donate-col-v6".*?<div class="footer-v6-bottom">', html, re.DOTALL)
if m:
    print('Footer donate col:')
    print(m.group(0).encode('ascii', 'ignore').decode('ascii'))
