import os

for filename in ['gallery.html', 'user.html', 'admin.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('style="display: block; margin-top: 50px;"', 'style="display: block;"')
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
