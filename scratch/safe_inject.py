import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add html2canvas script before </body>
if 'html2canvas.min.js' not in text:
    text = text.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n</body>')

# 2. Add donation actions HTML
actions_html = '''
                    <!-- Share and Download Buttons -->
                    <div class="donation-actions" id="donationActions">
                        <button onclick="downloadDonationImage()" class="donation-action-btn donation-download-btn">
                            <i class="fas fa-download"></i> डाउनलोड करा
                        </button>
                        <button onclick="shareDonationImage()" class="donation-action-btn donation-share-btn">
                            <i class="fas fa-share-alt"></i> शेअर करा
                        </button>
                    </div>
'''
if 'id="donationActions"' not in text:
    text = re.sub(r'(<div class="bank-details-section".*?</ul>\s*</div>\s*</div>)', r'\1' + actions_html, text, flags=re.DOTALL)

# 3. Add Javascript at the end (before </body>)
script_html = '''
    <!-- Donation Poster Script -->
    <script>
    async function captureDonationPoster() {
        const card = document.querySelector('.donation-card');
        const actions = document.getElementById('donationActions');
        const title = card.querySelector('.section-title');
        
        // Hide actions
        if(actions) actions.style.display = 'none';
        
        // Hide existing title ("देणगी / वर्गणी")
        let originalTitleDisplay = '';
        if (title) {
            originalTitleDisplay = title.style.display;
            title.style.display = 'none';
        }
        
        // Add Mandal Name
        const mandalName = document.createElement('h2');
        mandalName.id = 'tempMandalName';
        mandalName.innerText = (typeof settings !== 'undefined' && settings.orgName) ? settings.orgName : 'श्री शिवसृष्टी मित्र मंडळ';
        mandalName.style.textAlign = 'center';
        mandalName.style.color = '#ffeb3b';
        mandalName.style.fontFamily = "'Noto Sans Devanagari', sans-serif";
        mandalName.style.fontSize = '2.2rem';
        mandalName.style.fontWeight = '800';
        mandalName.style.marginBottom = '25px';
        mandalName.style.textShadow = '0 2px 10px rgba(0,0,0,0.5)';
        
        card.insertBefore(mandalName, card.firstChild);
        
        // Add a temporary solid background for better capture since glass-panel might capture poorly depending on background behind it
        const originalBg = card.style.background;
        card.style.background = '#1a1a1a'; // solid dark background
        
        let canvas = null;
        try {
            if (typeof html2canvas !== 'undefined') {
                canvas = await html2canvas(card, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#1a1a1a'
                });
            } else {
                alert('html2canvas is not loaded!');
            }
        } catch(e) {
            console.error('Error generating image:', e);
        }
        
        // Restore
        card.style.background = originalBg;
        mandalName.remove();
        if (title) title.style.display = originalTitleDisplay;
        if(actions) actions.style.display = 'flex';
        
        return canvas;
    }

    function downloadDonationImage() {
        const btn = document.querySelector('.donation-download-btn');
        if(btn) { btn.disabled = true; btn.innerHTML = 'Downloading...'; }
        
        captureDonationPoster().then(canvas => {
            if(canvas) {
                const link = document.createElement('a');
                link.download = 'Donation_Poster.jpg';
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
            }
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('इमेज तयार करताना त्रुटी आली.');
        }).finally(() => {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> डाउनलोड करा'; }
        });
    }

    async function shareDonationImage() {
        const btn = document.querySelector('.donation-share-btn');
        if(btn) { btn.disabled = true; btn.innerHTML = 'Sharing...'; }
        
        try {
            const canvas = await captureDonationPoster();
            if(canvas) {
                canvas.toBlob(async (blob) => {
                    const file = new File([blob], 'Donation_Poster.jpg', { type: 'image/jpeg' });
                    
                    const orgName = (typeof settings !== 'undefined' && settings.orgName) ? settings.orgName : 'श्री शिवसृष्टी मित्र मंडळ';
                    const shareData = {
                        title: orgName + ' - देणगी',
                        text: 'कृपया ' + orgName + ' ला सढळ हाताने मदत करा. खालील QR कोड वापरून आपण देणगी देऊ शकता.',
                        files: [file]
                    };

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share(shareData);
                    } else {
                        alert('शेअर करण्याचा पर्याय तुमच्या ब्राउझरमध्ये उपलब्ध नाही. कृपया डाउनलोड करून शेअर करा.');
                    }
                }, 'image/jpeg', 0.9);
            }
        } catch (err) {
            console.error('Error sharing image:', err);
            alert('शेअर करताना त्रुटी आली. कृपया डाउनलोड करून शेअर करा.');
        } finally {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-share-alt"></i> शेअर करा'; }
        }
    }
    </script>
'''
if 'captureDonationPoster' not in text:
    text = text.replace('</body>', script_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Carefully injected scripts!")
