import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Add buttons in donation actions
buttons_old = '''                    <div class="donation-actions" id="donationActions">
                        <button onclick="downloadDonationImage()" class="donation-action-btn donation-download-btn">
                            <i class="fas fa-download"></i> डाउनलोड करा
                        </button>
                        <button onclick="shareDonationImage()" class="donation-action-btn donation-share-btn">
                            <i class="fas fa-share-alt"></i> शेअर करा
                        </button>
                    </div>'''
buttons_new = '''                    <div class="donation-actions" id="donationActions" style="flex-wrap: wrap;">
                        <button onclick="downloadDonationImage()" class="donation-action-btn donation-download-btn">
                            <i class="fas fa-download"></i> डाउनलोड करा
                        </button>
                        <button onclick="shareDonationImage()" class="donation-action-btn donation-share-btn">
                            <i class="fas fa-share-alt"></i> शेअर करा
                        </button>
                        <button onclick="shareCustomPoster('vargani')" class="donation-action-btn donation-share-btn" style="background: linear-gradient(135deg, #10b981, #059669); flex: 1 1 45%;">
                            <i class="fas fa-share-alt"></i> वर्गणी आभार
                        </button>
                        <button onclick="shareCustomPoster('mahaprasad')" class="donation-action-btn donation-share-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); flex: 1 1 45%;">
                            <i class="fas fa-share-alt"></i> महाप्रसाद निमंत्रण
                        </button>
                    </div>'''
content = content.replace(buttons_old, buttons_new)

# 3. Add custom poster capture and share logic
# I will append this script before `</script>` of the Donation Poster script.
custom_poster_script = '''
    async function captureCustomPoster(type) {
        // Create a new container matching the donation card style
        const clone = document.createElement('div');
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '-9999px';
        clone.style.width = '900px';
        clone.style.maxWidth = '900px';
        clone.style.background = '#1a1a1a';
        clone.style.padding = '30px';
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.alignItems = 'center';
        clone.style.borderRadius = '15px';
        clone.style.border = '1px solid #333';
        document.body.appendChild(clone);

        // Add Banner Image
        const mandalPoster = document.createElement('img');
        mandalPoster.style.width = '100%';
        mandalPoster.style.height = 'auto';
        mandalPoster.style.borderRadius = '15px';
        mandalPoster.style.marginBottom = '25px';
        mandalPoster.style.display = 'block';
        mandalPoster.style.objectFit = 'contain';

        await new Promise((resolve) => {
            mandalPoster.onload = resolve;
            mandalPoster.onerror = resolve;
            mandalPoster.src = 'logo/Receipt.jpeg'; 
            clone.appendChild(mandalPoster);
        });

        // Add Website Link
        const tempWebsiteUrl = document.createElement('div');
        tempWebsiteUrl.style.color = '#e0e0e0';
        tempWebsiteUrl.style.textAlign = 'center';
        tempWebsiteUrl.style.fontSize = '18px';
        tempWebsiteUrl.style.marginBottom = '25px';
        tempWebsiteUrl.style.marginTop = '-10px';
        tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
        tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट: <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
        clone.appendChild(tempWebsiteUrl);

        // Add Title
        const titleText = type === 'vargani' ? '✧ वर्गणी आभार ✧' : '✧ महाप्रसाद निमंत्रण ✧';
        const titleHtml = `<h2 class="section-title" style="color: var(--text-highlight); text-align: center; font-size: 2rem; margin-bottom: 30px; letter-spacing: 2px;">${titleText}</h2>`;
        clone.insertAdjacentHTML('beforeend', titleHtml);

        // Add Custom Text Content
        let customText = '';
        if (window.appSettings) {
            customText = type === 'vargani' 
                ? (window.appSettings.varganiAabharText || 'येथे वर्गणी आभार संदेश येईल.') 
                : (window.appSettings.mahaprasadNimantranText || 'येथे महाप्रसाद निमंत्रण संदेश येईल.');
        } else {
            customText = type === 'vargani' ? 'येथे वर्गणी आभार संदेश येईल.' : 'येथे महाप्रसाद निमंत्रण संदेश येईल.';
        }

        const textContainer = document.createElement('div');
        textContainer.style.width = '100%';
        textContainer.style.background = 'rgba(255,255,255,0.05)';
        textContainer.style.padding = '40px';
        textContainer.style.borderRadius = '15px';
        textContainer.style.border = '1px solid rgba(255,255,255,0.1)';
        textContainer.style.color = '#e0e0e0';
        textContainer.style.fontSize = '24px';
        textContainer.style.lineHeight = '1.8';
        textContainer.style.textAlign = 'center';
        textContainer.style.whiteSpace = 'pre-wrap';
        textContainer.style.fontFamily = "'Poppins', sans-serif";
        textContainer.textContent = customText;
        clone.appendChild(textContainer);

        // Capture with html2canvas
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#1a1a1a',
            windowWidth: 1200
        });

        document.body.removeChild(clone);
        return { canvas, text: customText };
    }

    async function shareCustomPoster(type) {
        try {
            const result = await captureCustomPoster(type);
            const canvas = result.canvas;
            const customText = result.text;
            
            canvas.toBlob(async (blob) => {
                const fileName = type === 'vargani' ? 'Vargani_Aabhar.jpg' : 'Mahaprasad_Nimantran.jpg';
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                
                const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'मंडळ';
                const shareTitle = type === 'vargani' ? 'वर्गणी आभार' : 'महाप्रसाद निमंत्रण';
                
                const shareData = {
                    title: orgName + ' - ' + shareTitle,
                    text: customText + '\\n\\n🌐 अधिकृत वेबसाईट:\\nhttps://shivsrushti-utsav-mandal.onrender.com',
                    files: [file]
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    // Fallback to text sharing
                    if (navigator.share) {
                        await navigator.share({
                            title: shareData.title,
                            text: shareData.text
                        });
                    } else {
                        // Download fallback
                        const link = document.createElement('a');
                        link.download = fileName;
                        link.href = canvas.toDataURL('image/jpeg', 0.9);
                        link.click();
                        alert('तुमच्या डिव्हाइसवर शेअरिंग सपोर्टेड नाही. इमेज डाउनलोड झाली आहे.');
                    }
                }
            }, 'image/jpeg', 0.9);
        } catch (err) {
            console.error('Error sharing custom poster:', err);
            alert('पोस्टर तयार करताना किंवा शेअर करताना त्रुटी आली.');
        }
    }
'''

content = content.replace('function downloadDonationImage()', custom_poster_script + '\n    function downloadDonationImage()')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html successfully.")
