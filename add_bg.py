import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace main donation section logos with white background versions
old_main_logos = """                            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 10px; margin-bottom: 10px;">
                                <div class="payment-logos-main" style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style="height: 20px; width: auto;" loading="lazy">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 14px; width: auto;" loading="lazy">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style="height: 20px; width: auto;" loading="lazy">
                                </div>
                                <div style="display: flex; justify-content: center; align-items: center;">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style="height: 22px; width: auto;" loading="lazy">
                                </div>
                            </div>"""

new_main_logos = """                            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 10px; margin-bottom: 10px;">
                                <div class="payment-logos-main" style="display: flex; justify-content: center; align-items: center; gap: 12px;">
                                    <div style="background: white; padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style="height: 20px; width: auto;" loading="lazy">
                                    </div>
                                    <div style="background: white; padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 14px; width: auto;" loading="lazy">
                                    </div>
                                    <div style="background: white; padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style="height: 20px; width: auto;" loading="lazy">
                                    </div>
                                </div>
                                <div style="background: white; padding: 6px 15px; border-radius: 6px; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style="height: 22px; width: auto;" loading="lazy">
                                </div>
                            </div>"""

# Replace footer section logos with white background versions
old_footer_logos = """                                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 10px; margin-bottom: 10px;">
                                    <div class="payment-logos-main" style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style="height: 20px; width: auto;" loading="lazy">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 14px; width: auto;" loading="lazy">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style="height: 20px; width: auto;" loading="lazy">
                                    </div>
                                    <div style="display: flex; justify-content: center; align-items: center;">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style="height: 22px; width: auto;" loading="lazy">
                                    </div>
                                </div>"""

new_footer_logos = """                                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 10px; margin-bottom: 10px;">
                                    <div class="payment-logos-main" style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                                        <div style="background: white; padding: 5px 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style="height: 18px; width: auto;" loading="lazy">
                                        </div>
                                        <div style="background: white; padding: 5px 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 12px; width: auto;" loading="lazy">
                                        </div>
                                        <div style="background: white; padding: 5px 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" style="height: 18px; width: auto;" loading="lazy">
                                        </div>
                                    </div>
                                    <div style="background: white; padding: 5px 12px; border-radius: 6px; display: flex; justify-content: center; align-items: center;">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style="height: 20px; width: auto;" loading="lazy">
                                    </div>
                                </div>"""

if old_main_logos in content:
    content = content.replace(old_main_logos, new_main_logos)
else:
    print("Could not find old_main_logos")

if old_footer_logos in content:
    content = content.replace(old_footer_logos, new_footer_logos)
else:
    print("Could not find old_footer_logos")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
