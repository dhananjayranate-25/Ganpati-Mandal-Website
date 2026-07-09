import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<div class="donation-box">.*?(?=</section>)', text, re.DOTALL)
if m:
    print(m.group(0))
