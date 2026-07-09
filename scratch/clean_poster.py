import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove donation actions buttons
# They are under <div class="donation-actions">
actions_pattern = r'<div class="donation-actions">.*?</div>'
text = re.sub(actions_pattern, '', text, flags=re.DOTALL)

# 2. Fix html2canvas from <head>
text = text.replace('<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>', '')

# 3. Remove script at bottom
text = re.sub(r'<!-- Donation Poster Script -->.*?(?=</body>)', '', text, flags=re.DOTALL)

# Let's fix the footer divs mismatch!
# The missing div is from when we changed footer closing.
# In `split_footer.py`, we replaced `</footer>\s*</div>` with `</div></footer>` and missed a div.
# Let's count divs!
# Instead of guessing, we can use beautifulsoup to prettify and auto-close!
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
