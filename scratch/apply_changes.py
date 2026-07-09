import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Center the heading
html = re.sub(
    r'<h2 class="section-title">देणगी / वर्गणी</h2>',
    r'<h2 class="section-title" style="text-align: center; color: #ffeb3b; margin-bottom: 20px; font-family: \'Khand\', sans-serif; font-size: 2.2rem;">देणगी / वर्गणी</h2>',
    html
)

# 2. Add Mobile Number, UPI ID and Logos
qr_content = '''<div class="qr-frame">
                                <img src="uploads/donate_qr.jpg" alt="Donate QR Code" id="donationQRImg">
                            </div>
                            <p style="color: #fff; font-size: 16px; font-weight: bold; margin: 15px 0 0 0; letter-spacing: 1px; text-align: center;">मो.नं +91 9322134560</p>
                            <p style="color: #eee; font-size: 14px; margin: 3px 0 0 0; text-align: center; letter-spacing: 0.5px;">UPI ID : dhananjayranate@ybl</p>
                            <div class="payment-logos-main" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 8px; margin-bottom: 8px;">
                                <img src="uploads/gpay.svg" alt="GPay" style="height: 24px;">
                                <img src="uploads/phonepe.svg" alt="PhonePe" style="height: 24px;">
                                <img src="uploads/paytm.svg" alt="Paytm" style="height: 12px;">
                            </div>'''

html = re.sub(
    r'<div class="qr-frame">\s*<img src="uploads/donate_qr.jpg" alt="Donate QR Code" id="donationQRImg">\s*</div>',
    qr_content,
    html
)

# 3. Footer modifications
# Make 'donate-col-v6' center align its children
html = re.sub(r'<div class="footer-v6-col donate-col-v6">', r'<div class="footer-v6-col donate-col-v6" style="align-items: center;">', html)

# Add mobile number in the footer's donate-col, below QR (we had payment logos there).
# We can insert the mobile number before the payment logos.
footer_donate_inner = r'(<div class="qr-box-v6">.*?</div>)'
html = re.sub(footer_donate_inner, r'\1\n                                <p style="color: #666; font-size: 14px; font-weight: bold; margin: 5px 0 0 0; letter-spacing: 1px; text-align: center;"><i class="fas fa-phone-alt" style="color: #d4af37; margin-right: 5px; font-size: 12px;"></i>मो.नं +91 9322134560</p>', html, count=1, flags=re.DOTALL)

# Add Maha-aarti link in footer links section so it has 4 links.
# The user said "महाआरती dengi chy khali add kra mhnje barorbr 4 hoil donhi side la"
html = re.sub(
    r'(<a href="#" onclick="switchTab\(\'donate\'\); window\.scrollTo\(\{top:0, behavior:\'smooth\'\}\); return false;">देणगी</a>)',
    r'\1\n                            <a href="#" onclick="switchTab(\'aarti\'); window.scrollTo({top:0, behavior:\'smooth\'}); return false;">महाआरती</a>',
    html,
    count=1
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
