import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all Donation Poster Scripts
matches = list(re.finditer(r'<!-- Donation Poster Script -->.*?</script>', text, flags=re.DOTALL))

if len(matches) > 1:
    # Remove all but the last one
    for match in matches[:-1]:
        text = text.replace(match.group(0), '')
        
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Cleaned up duplicate scripts.")
else:
    print("No duplicates to clean.")
