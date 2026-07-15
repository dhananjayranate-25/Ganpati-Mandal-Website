with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('${(s.orgName.includes', '${s.orgName.includes')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
