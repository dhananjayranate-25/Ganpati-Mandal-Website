with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Login button to desktop nav
login_btn = '<a href="login.html" id="nav-login" class="nav-donate-btn" style="display: block !important; background-color: #3b82f6; margin-left: 10px;">Login</a>'
content = content.replace(
    '<a href="javascript:void(0)" id="nav-donate" class="nav-donate-btn" onclick="switchTab(\'donate\'); navLinks.classList.remove(\'active\'); return false;" style="display: block !important;">देणगी</a>',
    '<a href="javascript:void(0)" id="nav-donate" class="nav-donate-btn" onclick="switchTab(\'donate\'); navLinks.classList.remove(\'active\'); return false;" style="display: block !important;">देणगी</a>\n                ' + login_btn
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
