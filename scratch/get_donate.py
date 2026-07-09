import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<div id="donationSection".*?(?=<div id="committeeSection")', text, re.DOTALL)
if m:
    print(m.group(0))
