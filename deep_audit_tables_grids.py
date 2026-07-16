import re

files_to_check = ['index.html', 'admin.html', 'superadmin.html', 'member.html', 'login.html', 'gallery.html', 'user.html']

for filename in files_to_check:
    print(f'\\n==== Auditing {filename} ====')
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Check for grid-template-columns that use fixed pixels or percentages without auto-fit
            bad_grids = re.findall(r'grid-template-columns:\s*[^r][^;]+;', content)
            bad_grids = [g for g in bad_grids if 'auto-fit' not in g and 'auto-fill' not in g and '1fr 1fr' in g or 'px' in g]
            if bad_grids:
                print(f'Potential rigid grids: {len(bad_grids)}')
                print(list(set(bad_grids))[:3])
            
            # Check for display: flex without flex-wrap in containers that usually need it
            # (too noisy, let's skip)

            # Check for table responsiveness (overflow-x)
            if '<table' in content and 'overflow-x: auto' not in content and 'overflow-x:auto' not in content:
                print('Table found, but no overflow-x: auto handling seen in CSS!')
                
    except Exception as e:
        print(f'Error: {e}')
