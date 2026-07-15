
    async function captureDonationPoster() {
    const card = document.querySelector('.donation-card');
    
    const clone = card.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    
    // Force dimensions to trigger desktop media queries in html2canvas
    clone.style.width = '900px';
    clone.style.maxWidth = '900px';
    clone.style.background = '#1a1a1a';
    clone.style.padding = '30px';
    
    // Important: DO NOT make the main card row direction!
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    
    document.body.appendChild(clone);
    
    const actions = clone.querySelector('#donationActions');
    const title = clone.querySelector('.section-title');
    
    if(actions) actions.style.display = 'none';
    if(title) title.style.display = 'none';
    
    // The internal wrapper must be forced to row layout if media query doesn't trigger
    const wrapper = clone.querySelector('.donation-content-wrapper');
    if(wrapper) {
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'row';
        wrapper.style.justifyContent = 'space-around';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.width = '100%';
    }
    
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
        clone.insertBefore(mandalPoster, clone.firstChild);
    });
    
    const tempWebsiteUrl = document.createElement('div');
    tempWebsiteUrl.style.color = '#e0e0e0';
    tempWebsiteUrl.style.textAlign = 'center';
    tempWebsiteUrl.style.fontSize = '18px';
    tempWebsiteUrl.style.marginBottom = '25px';
    tempWebsiteUrl.style.marginTop = '-10px';
    tempWebsiteUrl.style.fontFamily = "'Poppins', sans-serif";
    tempWebsiteUrl.innerHTML = 'अधिकृत वेबसाईट: <span style="color: #ffd700;">https://shivsrushti-utsav-mandal.onrender.com</span>';
    clone.insertBefore(tempWebsiteUrl, mandalPoster.nextSibling);
    
    const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a1a1a',
        windowWidth: 1200
    });
    
    document.body.removeChild(clone);
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
                    text: `🌺 श्री गणेशाय नमः 🌺\n\nश्री गणेशोत्सव हा आपल्या सर्वांचा उत्सव आहे. या उत्सवाचे आयोजन अधिक भव्य, दिव्य आणि यशस्वी करण्यासाठी आपल्या सहकार्याची आम्हाला मनापासून अपेक्षा आहे.\n\nकृपया आपल्या सार्वजनिक गणेश उत्सव मंडळासाठी किमान ₹1111/- (एक हजार एकशे अकरा रुपये) वर्गणी/देणगी देऊन सहकार्य करा.\nआपण वर दिलेल्या QR कोड स्कॅन करून / UPI ID किंवा फोन नंबर द्वारे सहज देणगी देऊ शकता.\n\nआपले प्रत्येक योगदान आपल्या मंडळाचा गणेशोत्सव अधिक उत्साहाने, भक्तिभावाने आणि दिमाखात साजरा करण्यासाठी मोलाचे ठरेल. 🙏🌸\n\n॥ गणपती बाप्पा मोरया ॥\n॥ मंगलमूर्ती मोरया ॥\n॥ हर हर महादेव ॥\n\n– शिवसृष्टी सार्वजनिक उत्सव मंडळ, संगमनेर

🌐 अधिकृत वेबसाईट:
https://shivsrushti-utsav-mandal.onrender.com`,
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
    