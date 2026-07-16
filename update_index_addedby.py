with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Niyojan logic in index.html
niyojan_old_html = """                                ${item.description ? `<p style="color: #ccc; font-size: 0.9rem; margin: 0; line-height: 1.4;">${item.description}</p>` : ''}
                            </div>"""
niyojan_new_html = """                                ${item.description ? `<p style="color: #ccc; font-size: 0.9rem; margin: 0; line-height: 1.4;">${item.description}</p>` : ''}
                                ${item.addedBy ? `<div style="text-align: right; font-size: 0.8rem; color: #888; font-style: italic; margin-top: 10px;">Added by: ${item.addedBy}</div>` : ''}
                            </div>"""

if niyojan_old_html in content:
    content = content.replace(niyojan_old_html, niyojan_new_html)
else:
    print("Niyojan logic not found")

# Let's be more specific for Aarti
aarti_old_specific = """                            ${aarti.pujaDetails ? `<div style="margin-top: 10px; color: #eee; font-size: 0.85rem;"><strong style="color: #ffcc00;">पूजा माहिती:</strong> ${aarti.pujaDetails}</div>` : ''}
                        </div>"""
aarti_new_specific = """                            ${aarti.pujaDetails ? `<div style="margin-top: 10px; color: #eee; font-size: 0.85rem;"><strong style="color: #ffcc00;">पूजा माहिती:</strong> ${aarti.pujaDetails}</div>` : ''}
                            ${aarti.addedBy ? `<div style="text-align: right; font-size: 0.8rem; color: #ff5722; font-style: italic; margin-top: 10px;">Added by: ${aarti.addedBy}</div>` : ''}
                        </div>"""

if aarti_old_specific in content:
    content = content.replace(aarti_old_specific, aarti_new_specific)
else:
    print("Aarti logic not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
