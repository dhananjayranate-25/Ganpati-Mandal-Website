import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <img> tags with <div>
content = content.replace('<img src=\"\' + logoSrc + \'\" alt=\"Logo\" class=\"cover-logo\" onerror=\"this.style.display=\\\'none\\\'\">',
                          '<div class=\"cover-logo\" style=\"background-image: url(\\\'\' + logoSrc + \'\\\');\"></div>')

content = content.replace('<img src=\"${logoSrc}\" alt=\"Logo\" class=\"cover-logo\" onerror=\"this.style.display=\\\'none\\\'\">',
                          '<div class=\"cover-logo\" style=\"background-image: url(\\\'${logoSrc}\\\');\"></div>')

# Since the previous replace might have failed because of how the quotes were escaped, let's use regex to be safe.
# Find <img src="' + logoSrc + '" ... >
content = re.sub(r'<img src="\' \+ logoSrc \+ \'" alt="Logo" class="cover-logo" onerror="this\.style\.display=\'none\'">',
                 r'<div class="cover-logo" style="background-image: url(\'\' + logoSrc + \'\');"></div>', content)

# Find <img src="${logoSrc}" ... >
content = re.sub(r'<img src="\$\{logoSrc\}" alt="Logo" class="cover-logo" onerror="this\.style\.display=\'none\'">',
                 r'<div class="cover-logo" style="background-image: url(\'\$\{logoSrc\}\');"></div>', content)

# Update CSS for .cover-logo
old_css = r'\.cover-logo\{[^}]*\}'
new_css = '.cover-logo{width:100%;height:100%;border-radius:50%;border:6px solid #ffd700;box-shadow:0 0 0 6px #ffffff, 0 0 60px rgba(255,140,0,0.8), 0 10px 30px rgba(0,0,0,0.8);background-color:rgba(255,255,255,0.98);background-size:cover;background-position:center;background-repeat:no-repeat;position:relative;z-index:2;box-sizing:border-box;}'
content = re.sub(old_css, new_css, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
