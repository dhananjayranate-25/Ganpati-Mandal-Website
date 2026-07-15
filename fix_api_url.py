import os
for file in ['index.html', 'admin.html', 'gallery.html']:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace("fetch('/uploads/' + filename)", "fetch((typeof API_URL !== 'undefined' ? API_URL : '') + '/uploads/' + filename)")
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
