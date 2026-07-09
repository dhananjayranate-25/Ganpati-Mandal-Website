import re
with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()
for match in re.findall(r"app\.(get|post|delete)\(.('/api/[^']+')", text):
    print(match[0], match[1])
