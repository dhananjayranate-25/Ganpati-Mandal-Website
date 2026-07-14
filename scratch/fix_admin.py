with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<div class="data-table-container" style="margin-top: 30px;">', '<div class="data-table-container" style="margin-top: 30px; overflow-x: auto; width: 100%;">')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
