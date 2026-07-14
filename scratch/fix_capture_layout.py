import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'async function captureDonationPoster\(\) \{.*?(?=function downloadDonationImage)', re.DOTALL)

new_func = '''async function captureDonationPoster() {
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

    '''

new_content = pattern.sub(new_func, content)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
