import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Check if the bad injection exists
if '</body></html>`;' in text and '<!-- Donation Poster Script -->' in text:
    # We want to replace the first occurrence (which is inside the template literal) 
    # but not the second occurrence (which is at the end of the file, if it exists).
    # Wait, the one at the end of the file doesn't have </html>`; (no backtick)
    # The one at the end of the file is just `</body>\n</html>`!
    # So `</body></html>\`;` perfectly targets the template literal one.
    
    new_text = re.sub(r'<!-- Donation Poster Script -->.*?</script>\s*</body></html>`;', '</body></html>`;', text, flags=re.DOTALL)
    
    if new_text != text:
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print("Fixed template literal injection!")
    else:
        print("Regex didn't match anything!")
else:
    print("Pattern not found!")
