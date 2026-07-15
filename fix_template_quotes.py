with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find the return statement in generatePDFHTML
# It looks like: return '<!DOCTYPE html>...</body></html>';
# We want to replace the first ' with ` and the last ' before ; with `

def replace_quotes(match):
    # match.group(0) is the full match
    # match.group(1) is the content inside the single quotes
    return "return `" + match.group(1) + "`;"

# Use regex to find the string starting with '<!DOCTYPE html>' and ending with '</body></html>'
content = re.sub(r"return\s+'(<!DOCTYPE html>.*?</body></html>)';", replace_quotes, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
