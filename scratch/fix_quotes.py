with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the end quote
text = text.replace("</body></html>';", "</body></html>`;")
text = text.replace("</body></html>;", "</body></html>`;")
text = text.replace("</body></html>\\';", "</body></html>`;")
text = text.replace("</body></html>`;", "</body></html>`;") # idempotent

# Fix the start quote
text = text.replace("return <!DOCTYPE", "return `<!DOCTYPE")
text = text.replace("return '<!DOCTYPE", "return `<!DOCTYPE")

# Now since it is a template literal, we must escape the JS template literal interpolation sequences `${` that appear inside the HTML, IF ANY.
# But wait, `s.orgName` is concatenated using `' + s.orgName + '`.
# If it's a template literal, `' + s.orgName + '` will just be printed as literal text unless we change it!
# Wait! If it's a template literal, `' + s.orgName + '` inside it will NOT evaluate the JS, it will literally output the characters `' + s.orgName + '` into the HTML!
# But the original code was: `return '<!DOCTYPE... ' + s.orgName + ' ...';`
# This means the original code was STRING CONCATENATION!
# Why did I want to change it to a template literal?!
# Because the user ran a formatter that added literal newlines, which broke string concatenation!
# If I change it to a template literal, ALL the `+ s.orgName +` concatenations will BREAK because they will literally render as text!
# To fix this properly, I must NOT use a template literal. I must restore it as a SINGLE QUOTE string, and REMOVE the literal newlines!
# OR, I can use a template literal and replace `' + ... + '` with `${...}`!
# Removing literal newlines is much safer because I know exactly where they start and end.
# Actually, wait. Let's just remove the literal newlines from the entire `createCoverHTML` string!
import re
start_idx = text.find("return '<!DOCTYPE")
if start_idx == -1:
    start_idx = text.find("return <!DOCTYPE")
if start_idx == -1:
    start_idx = text.find("return `<!DOCTYPE")
    
if start_idx != -1:
    end_idx = text.find("</body></html>", start_idx) + len("</body></html>")
    
    content = text[start_idx:end_idx]
    
    # Revert it to single quote start and end, and remove all newlines
    content = content.replace("return <!DOCTYPE", "return '<!DOCTYPE")
    content = content.replace("return `<!DOCTYPE", "return '<!DOCTYPE")
    
    # Remove literal newlines
    content = content.replace('\\n', '') # wait, literal newlines are \n
    content = content.replace('\n', '')
    
    text = text[:start_idx] + content + "';" + text[text.find('\n', end_idx):]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done fixing!')
