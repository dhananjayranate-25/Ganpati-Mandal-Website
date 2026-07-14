import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_text = "कृपया आमच्या मंडळाला सढळ हाताने वर्गणी/देणगी देऊन सहकार्य करा.\\nआपण खाली दिलेल्या QR Code किंवा UPI द्वारे सहज देणगी देऊ शकता.\\n\\nआपले प्रत्येक योगदान आम्हाला अधिक उत्साहाने आणि भक्तिभावाने श्री गणरायाची सेवा करण्यास प्रेरणा देईल."
new_text = "कृपया आपल्या सार्वजनिक गणेश उत्सव मंडळासाठी किमान ₹1111/- (एक हजार एकशे अकरा रुपये) वर्गणी/देणगी देऊन सहकार्य करा.\\nआपण वर दिलेल्या QR कोड स्कॅन करून / UPI ID किंवा फोन नंबर द्वारे सहज देणगी देऊ शकता.\\n\\nआपले प्रत्येक योगदान आपल्या मंडळाचा गणेशोत्सव अधिक उत्साहाने, भक्तिभावाने आणि दिमाखात साजरा करण्यासाठी मोलाचे ठरेल."

if old_text in content:
    content = content.replace(old_text, new_text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Old text not found")
