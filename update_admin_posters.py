import os
import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add inputs in tab-home
# Look for: <h2>Hero Banner Image</h2>
# We'll insert it right after the Hero Banner section or before it.
# Let's insert it after hero banner preview.
inputs_html = '''
                    <!-- Custom Poster Texts -->
                    <div class="form-group" style="margin-top: 30px;">
                        <h3 style="color: var(--text-primary); margin-bottom: 10px;">वर्गणी आभार संदेश (Vargani Aabhar Text)</h3>
                        <textarea id="varganiAabharText" class="form-control" rows="4" placeholder="येथे वर्गणी आभार संदेश टाईप करा..."></textarea>
                    </div>
                    <div class="form-group" style="margin-top: 20px;">
                        <h3 style="color: var(--text-primary); margin-bottom: 10px;">महाप्रसाद निमंत्रण संदेश (Mahaprasad Nimantran Text)</h3>
                        <textarea id="mahaprasadNimantranText" class="form-control" rows="4" placeholder="येथे महाप्रसाद निमंत्रण संदेश टाईप करा..."></textarea>
                    </div>
'''
content = content.replace('                    <button class="btn btn-primary ripple" onclick="saveSettings()">Save General Settings</button>',
                         inputs_html + '                    <button class="btn btn-primary ripple" onclick="saveSettings()">Save General Settings</button>')

# 2. Update loadSettings()
load_old = '''                        document.getElementById('upiId').value = data.settings.upiId || '';
                    }'''
load_new = '''                        document.getElementById('upiId').value = data.settings.upiId || '';
                        
                        if (document.getElementById('varganiAabharText')) {
                            document.getElementById('varganiAabharText').value = data.settings.varganiAabharText || '';
                        }
                        if (document.getElementById('mahaprasadNimantranText')) {
                            document.getElementById('mahaprasadNimantranText').value = data.settings.mahaprasadNimantranText || '';
                        }
                    }'''
content = content.replace(load_old, load_new)

# 3. Update saveSettings()
save_old = '''                const upiId = document.getElementById('upiId').value.trim();'''
save_new = '''                const upiId = document.getElementById('upiId').value.trim();
                const varganiAabharText = document.getElementById('varganiAabharText') ? document.getElementById('varganiAabharText').value.trim() : '';
                const mahaprasadNimantranText = document.getElementById('mahaprasadNimantranText') ? document.getElementById('mahaprasadNimantranText').value.trim() : '';'''
content = content.replace(save_old, save_new)

payload_old = '''                    upiId
                };'''
payload_new = '''                    upiId,
                    varganiAabharText,
                    mahaprasadNimantranText
                };'''
content = content.replace(payload_old, payload_new)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated admin.html successfully.")
