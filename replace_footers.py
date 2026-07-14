import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_tag = '<footer class="new-site-footer-v6"'
end_tag = '</footer>'

start_idx = content.find(start_tag)
if start_idx != -1:
    end_idx = content.find(end_tag, start_idx) + len(end_tag)
    footer_html = content[start_idx:end_idx]

    for filename in ['gallery.html', 'admin.html', 'user.html']:
        try:
            with open(filename, 'r', encoding='utf-8') as gf:
                gallery_content = gf.read()
            
            # Find existing footer in these pages. They might have '<footer class="footer-v6">' or just '<footer'.
            # Searching for '<footer ' or '<footer'
            g_start_idx = gallery_content.find('<footer')
            if g_start_idx != -1:
                g_end_idx = gallery_content.find('</footer>', g_start_idx) + len('</footer>')
                
                new_gallery_content = gallery_content[:g_start_idx] + footer_html + gallery_content[g_end_idx:]
                with open(filename, 'w', encoding='utf-8') as gf:
                    gf.write(new_gallery_content)
                print(f'Replaced footer in {filename}')
            else:
                print(f'No footer found in {filename}')
        except Exception as e:
            print(f'Error processing {filename}', e)
else:
    print('Footer not found in index.html')
