import os

for filename in ['gallery.html', 'user.html', 'admin.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'loadAppearanceSettingsHome();' not in content:
        # Instead of replacing </script></body>, just look for DOMContentLoaded and add it there
        if 'loadGalleryAlbums();' in content:
            content = content.replace('loadGalleryAlbums();', 'loadGalleryAlbums();\n        if(typeof loadAppearanceSettingsHome === "function") loadAppearanceSettingsHome();')
        elif 'loadAdminData();' in content:
            content = content.replace('loadAdminData();', 'loadAdminData();\n        if(typeof loadAppearanceSettingsHome === "function") loadAppearanceSettingsHome();')
        elif 'loadUserData();' in content:
            content = content.replace('loadUserData();', 'loadUserData();\n        if(typeof loadAppearanceSettingsHome === "function") loadAppearanceSettingsHome();')
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filename}')
    else:
        print(f'{filename} already fixed')
