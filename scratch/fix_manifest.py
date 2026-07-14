def insert_after(filename, target, insertion):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    idx = content.find(target)
    if idx == -1: return False
    
    new_content = content[:idx+len(target)] + '\n' + insertion + content[idx+len(target):]
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

insert_after('index.html', '<head>', '    <link rel="manifest" href="manifest.json">\n    <meta name="theme-color" content="#ff8c00">')
insert_after('admin.html', '<head>', '    <link rel="manifest" href="manifest.json">\n    <meta name="theme-color" content="#ff8c00">')
