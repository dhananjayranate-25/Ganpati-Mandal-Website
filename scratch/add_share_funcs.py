import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

script = """
    <!-- Donation Poster Script -->
    <script>
    async function captureDonationPoster() {
        const poster = document.querySelector('.donation-box');
        if (!poster) return null;
        
        // Save current styles
        const originalStyle = poster.getAttribute('style') || '';
        
        // Temporarily adjust for capture
        poster.style.margin = '0';
        poster.style.transform = 'none';
        poster.style.boxShadow = 'none';
        poster.style.borderRadius = '0';
        
        try {
            const canvas = await html2canvas(poster, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: poster.scrollWidth,
                windowHeight: poster.scrollHeight
            });
            return canvas.toDataURL('image/jpeg', 0.9);
        } catch (error) {
            console.error('Error generating poster:', error);
            alert('Something went wrong. Please try again.');
            return null;
        } finally {
            // Restore styles
            poster.setAttribute('style', originalStyle);
        }
    }

    async function downloadDonationImage() {
        const btn = document.querySelector('.donation-download-btn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wait...';
        btn.disabled = true;

        const dataUrl = await captureDonationPoster();
        if (dataUrl) {
            const link = document.createElement('a');
            link.download = 'Shivsrushti_Mandal_Donation.jpg';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }

    async function shareDonationImage() {
        const btn = document.querySelector('.donation-share-btn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wait...';
        btn.disabled = true;

        const dataUrl = await captureDonationPoster();
        if (dataUrl) {
            try {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const file = new File([blob], 'Shivsrushti_Mandal_Donation.jpg', { type: 'image/jpeg' });

                if (navigator.share && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'श्री शिवसृष्टी मित्र मंडळ - देणगी',
                        text: 'श्री शिवसृष्टी मित्र मंडळ, गुळेवाडी - देणगी/वर्गणी देण्यासाठी खालील QR कोड स्कॅन करा किंवा बँक तपशील वापरा.'
                    });
                } else {
                    alert('Sharing is not supported on this device/browser. Please use the Download option instead.');
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        }

        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }
    </script>
"""

# Insert before </body>
text = text.replace('</body>', script + '\n    </body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added share scripts successfully.")
