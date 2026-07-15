import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update cover-logo CSS (padding to 0 and object-fit to cover)
content = re.sub(r'(\.cover-logo\{[^}]*object-fit:)contain(.*?padding:)[^;]+;', r'\g<1>cover\g<2>0px;', content)

# 2. Update cover-mandal-name in string concatenation (createCoverHTML)
new_html_concat = "' + (s.orgName.includes('शिवसृष्टी') ? '<div style=\"font-size:2.2em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;\">शिवसृष्टी</div><div style=\"font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;\">सार्वजनिक उत्सव मंडळ</div><div style=\"font-size:1.1em; font-weight:800; color:#ffcc00;\">संगमनेर <span style=\"color:#d32f2f;\">🚩</span></div>' : s.orgName) + '"
content = re.sub(r'\' \+ s\.orgName \+ \'', new_html_concat, content)

# 3. Update cover-mandal-name in template literal (Donation Poster)
new_html_template = "${s.orgName.includes('शिवसृष्टी') ? '<div style=\"font-size:2.2em; font-weight:900; color:#ffd700; text-shadow:0 0 25px rgba(255,140,0,1); line-height:1.2; margin-bottom:12px;\">शिवसृष्टी</div><div style=\"font-size:1.1em; font-weight:800; color:#ffcc00; margin-bottom:5px;\">सार्वजनिक उत्सव मंडळ</div><div style=\"font-size:1.1em; font-weight:800; color:#ffcc00;\">संगमनेर <span style=\"color:#d32f2f;\">🚩</span></div>' : s.orgName}"

# Find the existing ternary logic inside ${s.orgName === ... } and replace it
content = re.sub(r'\$\{s\.orgName === [^\}]+\}', new_html_template, content)

# Remove the red border from cover-mandal-name CSS which is causing the side lines
content = re.sub(r'border-left:6px solid #[a-zA-Z0-9]+;', '', content)
content = re.sub(r'border-right:6px solid #[a-zA-Z0-9]+;', '', content)
content = re.sub(r'padding:10px 35px;', 'padding:10px 0;', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to index.html")
