import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<div id="donationSection".*?(?=<div id="committeeSection"|<div id="niyojanSection"|<div id="aartiSection"|<footer)', text, re.DOTALL)
if m:
    s = m.group(0)
    print('GPay logo:', 'Google_Pay_Logo' in s)
    print('Paytm logo:', 'Paytm_Logo' in s)
    print('PhonePe logo:', 'PhonePe_Logo' in s)
    print('Mobile 9322134560:', '9322134560' in s)
    print('dhananjayranate@ybl:', 'dhananjayranate@ybl' in s)
else:
    print('donationSection not found!')
