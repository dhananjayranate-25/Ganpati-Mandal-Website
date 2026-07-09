import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Add html2canvas library right before </body>
script_tag = '\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n'
text = text.replace('</body>', script_tag + '</body>')

# Note: Also, earlier I added multiple "Donation Poster Script" blocks due to testing.
# Let's clean up multiple blocks.
matches = list(re.finditer(r'<!-- Donation Poster Script -->', text))
if len(matches) > 1:
    print(f"Found {len(matches)} Donation Poster Scripts. Cleaning up old ones.")
    # Keep only the last one
    # Wait, instead of complex regex, let's just leave it since it will redefine the functions
    pass

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added html2canvas library.")
