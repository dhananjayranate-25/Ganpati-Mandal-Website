import os

script_to_add = """
    async function loadFooterQR() {
        try {
            const response = await fetch('/api/settings');
            const result = await response.json();
            if (result.success && result.data && result.data.donateQRCode) {
                const footerQrImg = document.getElementById('footerDonationQRImg');
                if (footerQrImg) footerQrImg.src = result.data.donateQRCode;
            }
        } catch(e) {}
    }
    loadFooterQR();
"""

for filename in ['gallery.html', 'user.html', 'admin.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'loadFooterQR();' not in content:
        if 'if(typeof loadAppearanceSettingsHome === "function") loadAppearanceSettingsHome();' in content:
            content = content.replace('if(typeof loadAppearanceSettingsHome === "function") loadAppearanceSettingsHome();', script_to_add)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filename}')
