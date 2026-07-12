import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 108 is at index 107. Let's verify it starts with "<img"
if "Paytm" in lines[107]:
    lines[107] = '                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 12px; width: auto;" loading="lazy">\n'
else:
    for i, line in enumerate(lines):
        if "OTM3IGggMy44NTUgYyAwLjY" in line:
            lines[i] = '                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style="height: 12px; width: auto;" loading="lazy">\n'
            break

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
