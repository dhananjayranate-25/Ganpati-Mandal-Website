import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the stretching pill by adding align-items: center
content = content.replace(
    '<div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">',
    '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">'
)
# Make sure display: inline-flex or inline-block is on the pill to control height better, and remove flex stretch issues
content = content.replace(
    '<span style="background: rgba(212,175,55,0.2); color: #ffeb3b; padding: 2px 10px; border-radius: 20px; font-size: 0.9rem;">',
    '<span style="background: rgba(212,175,55,0.2); color: #ffeb3b; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px; height: fit-content; line-height: 1;">'
)
# Also fix the icon inside it to not have an empty space next to time if we use gap
content = content.replace('<i class="far fa-clock"></i> ${time12}', '<i class="far fa-clock"></i>${time12}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
