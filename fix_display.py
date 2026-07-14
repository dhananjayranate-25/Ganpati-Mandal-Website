import os
for filename in ['gallery.html', 'admin.html', 'user.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('id="siteFooter" style="display: none;"', 'id="siteFooter" style="display: block; margin-top: 50px;"')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed display for {filename}')
