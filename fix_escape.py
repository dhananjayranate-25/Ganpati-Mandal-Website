import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<div class="cover-logo" style="background-image: url[^\"]+"></div></div><div class="cover-mandal-name">\' \+',
                 """<div class="cover-logo" style="background-image: url('""" + """' + logoSrc + '""" + """');"></div></div><div class="cover-mandal-name">' +""", content)

content = re.sub(r'<div class="cover-logo" style="background-image: url[^\"]+"></div>\s*</div>\s*<div class="cover-mandal-name">\$\{s\.orgName',
                 """<div class="cover-logo" style="background-image: url('${logoSrc}');"></div>\n      </div>\n      <div class="cover-mandal-name">${s.orgName""", content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
