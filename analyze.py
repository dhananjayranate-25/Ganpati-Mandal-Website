import re

files = ['index.html', 'member.html', 'superadmin.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        print(f'=== {f} ===')
        meta_present = '<meta name="viewport"' in content
        print(f'Viewport Meta: {meta_present}')
        
        media_queries = re.findall(r'@media[^{]+\{', content)
        print(f'Media Queries count: {len(media_queries)}')
        
        hard_widths = re.findall(r'width:\s*[0-9]+px;', content)
        print(f'Hardcoded widths (px): {len(hard_widths)}')
