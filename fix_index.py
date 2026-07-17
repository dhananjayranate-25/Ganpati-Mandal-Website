with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken script tag
content = content.replace(
    '<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js">\n// Auto-wrap tables',
    '<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n<script>\n// Auto-wrap tables'
)

# Add OpenGraph tags below title
og_tags = '''
<!-- OpenGraph Meta Tags for WhatsApp/Facebook Previews -->
<meta property="og:title" content="Shivsrushti Boyz - Ganpati Vargani Cashbook">
<meta property="og:description" content="शिवसृष्टी सार्वजनिक उत्सव मंडळ संगमनेर - गणपती वर्गणी आणि कॅशबुक">
<meta property="og:image" content="https://shivsrushti-boyz.onrender.com/logo/logo.jpeg">
<meta property="og:url" content="https://shivsrushti-boyz.onrender.com/">
<meta property="og:type" content="website">
'''

if 'og:title' not in content:
    content = content.replace(
        '<title>Ganpati Vargani Cashbook - Shivsrushti</title>',
        '<title>Ganpati Vargani Cashbook - Shivsrushti</title>' + og_tags
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully added OpenGraph tags and fixed script tag.')
