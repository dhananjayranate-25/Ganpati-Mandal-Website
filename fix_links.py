import os
for filename in ['gallery.html', 'admin.html', 'user.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'home\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'ganeshotsav\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'committee\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'niyojan\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'contact\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'donate\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')
    content = content.replace('href="javascript:void(0)" onclick="switchTab(\'aarti\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;"', 'href="index.html"')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed links in {filename}')
