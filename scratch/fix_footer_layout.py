target = """                <div class="footer-v6-col donate-col-v6">
                    <h3>देणगी</h3>
                    <div class="donate-flex">
                        <div class="qr-box-v6">
                            <img src="uploads/donate_qr.jpg" alt="QR" id="footerDonationQRImg" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'qr-fallback\\'>QR</div>'">
                        </div>
                        <div class="payment-logos-v6">
                            <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center;">
                                <p style="color: #333; font-size: 14px; font-weight: bold; margin: 0; letter-spacing: 1px; text-align: center;"><i class="fas fa-phone-alt" style="color: #d4af37; margin-right: 5px; font-size: 12px;"></i>मो.नं +91 9322134560</p>
                                <p style="color: #555; font-size: 13px; margin: 3px 0 0 0; text-align: center; letter-spacing: 0.5px;">UPI ID : dhananjayranate@ybl</p>
                                <img src="uploads/gpay.svg" alt="GPay" style="height: 20px;">
                                <img src="uploads/phonepe.svg" alt="PhonePe" style="height: 20px;">
                                <img src="uploads/paytm.svg" alt="Paytm" style="height: 10px;">
                            </div>
                        </div>
                    </div>
                </div>"""

replacement = """                <div class="footer-v6-col donate-col-v6">
                    <div class="donate-flex" style="align-items: flex-start; justify-content: flex-start; gap: 20px;">
                        <div class="qr-box-v6" style="margin-top: 35px;">
                            <img src="uploads/donate_qr.jpg" alt="QR" id="footerDonationQRImg" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'qr-fallback\\'>QR</div>'">
                        </div>
                        <div class="payment-logos-v6" style="display: flex; flex-direction: column; align-items: center;">
                            <h3 style="align-self: flex-start; width: 100%; text-align: left;">देणगी</h3>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; margin-top: 8px;">
                                <p style="color: #333; font-size: 14px; font-weight: bold; margin: 0; letter-spacing: 1px;"><i class="fas fa-phone-alt" style="color: #d4af37; margin-right: 5px; font-size: 12px;"></i>मो.नं +91 9322134560</p>
                                <p style="color: #555; font-size: 13px; margin: 0; letter-spacing: 0.5px;">UPI ID : dhananjayranate@ybl</p>
                                <div style="display: flex; gap: 15px; align-items: center; margin-top: 5px;">
                                    <img src="uploads/gpay.svg" alt="GPay" style="height: 18px;">
                                    <img src="uploads/phonepe.svg" alt="PhonePe" style="height: 18px;">
                                    <img src="uploads/paytm.svg" alt="Paytm" style="height: 10px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>"""

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

if target in text:
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text.replace(target, replacement))
    print('Replaced successfully')
else:
    print('Target not found')
