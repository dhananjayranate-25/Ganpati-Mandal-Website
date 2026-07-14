import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace href="#" with href="javascript:void(0)" for navigation links to prevent hashchange bugs
replacements = [
    ('<a href="#" id="nav-home">', '<a href="javascript:void(0)" id="nav-home">'),
    ('<a href="#" id="nav-ganeshotsav">', '<a href="javascript:void(0)" id="nav-ganeshotsav">'),
    ('<a href="#" id="nav-committee">', '<a href="javascript:void(0)" id="nav-committee">'),
    ('<a href="#" id="nav-niyojan">', '<a href="javascript:void(0)" id="nav-niyojan">'),
    ('<a href="#" id="nav-aarti">', '<a href="javascript:void(0)" id="nav-aarti">'),
    ('<a href="#" id="nav-contact">', '<a href="javascript:void(0)" id="nav-contact">'),
    ('<a href="#" class="nav-donate-btn" id="nav-donate">', '<a href="javascript:void(0)" class="nav-donate-btn" id="nav-donate">'),
    
    # Also replace footer links just in case
    ('<a href="#" onclick="switchTab(\'home\');', '<a href="javascript:void(0)" onclick="switchTab(\'home\');'),
    ('<a href="#" onclick="switchTab(\'ganeshotsav\');', '<a href="javascript:void(0)" onclick="switchTab(\'ganeshotsav\');'),
    ('<a href="#" onclick="switchTab(\'committee\');', '<a href="javascript:void(0)" onclick="switchTab(\'committee\');'),
    ('<a href="#" onclick="switchTab(\'niyojan\');', '<a href="javascript:void(0)" onclick="switchTab(\'niyojan\');'),
    ('<a href="#" onclick="switchTab(\'contact\');', '<a href="javascript:void(0)" onclick="switchTab(\'contact\');'),
    ('<a href="#" onclick="switchTab(\'donate\');', '<a href="javascript:void(0)" onclick="switchTab(\'donate\');'),
    ('<a href="#" onclick="switchTab(\'aarti\');', '<a href="javascript:void(0)" onclick="switchTab(\'aarti\');'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
