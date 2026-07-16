with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Niyojan addedBy layout
old_niyojan_addedBy = '${item.addedBy ? `<div style="text-align: right; font-size: 0.8rem; color: #888; font-style: italic; margin-top: 10px;">Added by: ${item.addedBy}</div>` : \'\'}'
new_niyojan_addedBy = '${item.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 10px;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#d4af37;"></i>${item.addedBy}</span></div>` : \'\'}'

# Replace Aarti addedBy layout
old_aarti_addedBy = '${aarti.addedBy ? `<div style="text-align: right; font-size: 0.8rem; color: #ff5722; font-style: italic; margin-top: 10px;">Added by: ${aarti.addedBy}</div>` : \'\'}'
new_aarti_addedBy = '${aarti.addedBy ? `<div style="display:flex; justify-content:flex-end; margin-top: 12px; grid-column: 1 / -1;"><span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 15px; font-size: 0.75rem; color:#aaa;"><i class="fas fa-user-edit" style="margin-right:5px; color:#ffcc00;"></i>${aarti.addedBy}</span></div>` : \'\'}'

content = content.replace(old_niyojan_addedBy, new_niyojan_addedBy)
content = content.replace(old_aarti_addedBy, new_aarti_addedBy)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed index.html')
