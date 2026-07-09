with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Look for the broken JS string
if r"</body></html>\';" in text:
    print("Found escaped single quote at end of html string!")
    text = text.replace(r"</body></html>\';", r"</body></html>';")

if r'style=\"' in text:
    print("Found escaped double quotes in style!")
    text = text.replace(r'style=\"', 'style="')
    text = text.replace(r'padding=\"', 'padding="')
    text = text.replace(r'font-size:12px;\"', 'font-size:12px;"')
    
# Wait, if `style=\"` is in a single quoted string, it's valid JS but maybe the regex engine parsed it wrong?
# No, if the string ends abruptly, maybe there's a real unescaped single quote or newline.
# Let's check for any stray single quotes inside the string.
# The string is `<!DOCTYPE html>... </html>`
m = re.search(r"return '<!DOCTYPE html>.*?(?=    })", text, re.DOTALL)
if m:
    s = m.group(0)
    print("Found the string! Length:", len(s))
    # Count unescaped single quotes
    quotes = re.findall(r"(?<!\\)'", s)
    print("Number of unescaped single quotes:", len(quotes))
else:
    print("String not found")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
