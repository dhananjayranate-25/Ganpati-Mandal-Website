import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The incorrect injection inside the template literal
bad_injection = r'<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n    </body></html>`;'

# Let's replace it with the correct closing
text = re.sub(r'\n\s*<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n\s*</body></html>`;', '\n</body></html>`;', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed bad injection from createCoverHTML")
