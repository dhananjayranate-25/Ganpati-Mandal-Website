import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update cover-logo CSS
content = re.sub(r'(\.cover-logo\{[^}]*object-fit:)contain(.*?padding:)12px', r'\g<1>cover\g<2>0px', content)

# 2. Update the mandal name format.
new_html = '<div style="font-size:2.2em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;">शिवसृष्टी</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;">सार्वजनिक उत्सव मंडळ</div><div style="font-size:1.1em; font-weight:800; color:#ffcc00;">संगमनेर <span style="color:#d32f2f;">▶</span></div>'

content = re.sub(r'<div style="font-size:1\.4em;.*?dYsc</div>', new_html, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
