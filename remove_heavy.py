with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove heavy scripts from head
content = content.replace('<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>', '')
content = content.replace('<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>', '')
content = content.replace('<script defer src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>', '')
content = content.replace('<script defer src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Heavy PDF scripts removed from head.')
