
    async function captureDonationPoster() {
        const card = document.querySelector('.donation-card');
        const actions = document.getElementById('donationActions');
        const title = card.querySelector('.section-title');
        
        // Hide actions
        if(actions) actions.style.display = 'none';
        
        // Hide existing title ("देणगी / वर्गणी")
        let originalTitleDisplay = title ? title.style.display : '';
        if(title) title.style.display = 'none';
        
        // Add Mandal Name
        const mandalName = document.createElement('h2');
        mandalName.id = 'tempMandalName';
        mandalName.innerText = (typeof settings !== 'undefined' && settings.orgName) ? settings.orgName : (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName ? appSettings.pdfCustomSettings.orgName : 'श्री शिवसृष्टी मित्र मंडळ');
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
        
        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#1a1a1a'
        });
        
        // Restore
        card.style.background = originalBg;
        mandalName.remove();
        if(title) title.style.display = originalTitleDisplay;
        if(actions) actions.style.display = 'flex';
        
        return canvas;
    }

    function downloadDonationImage() {
        captureDonationPoster().then(canvas => {
            const link = document.createElement('a');
            link.download = 'Donation_Poster.jpg';
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.click();
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('इमेज तयार करताना त्रुटी आली.');
        });
    }

    async function shareDonationImage() {
        try {
            const canvas = await captureDonationPoster();
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'Donation_Poster.jpg', { type: 'image/jpeg' });
                
                const orgName = (typeof appSettings !== 'undefined' && appSettings.pdfCustomSettings && appSettings.pdfCustomSettings.orgName) ? appSettings.pdfCustomSettings.orgName : 'मंडळ';
                const shareData = {
                    title: orgName + ' - देणगी',
                    text: 'कृपया आमच्या ' + orgName + 'ला सढळ हाताने मदत करा. खालील QR कोड वापरून आपण देणगी देऊ शकता.',
                    files: [file]
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share(shareData);
                } else {
                    alert('शेअर करण्याचा पर्याय तुमच्या ब्राउझरमध्ये उपलब्ध नाही. कृपया डाउनलोड करून शेअर करा.');
                }
            }, 'image/jpeg', 0.9);
        } catch (err) {
            console.error('Error sharing image:', err);
            alert('शेअर करताना त्रुटी आली. कृपया डाउनलोड करून शेअर करा.');
        }
    }
    