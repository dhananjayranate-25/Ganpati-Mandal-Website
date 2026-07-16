import re

with open('superadmin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Grids
content = re.sub(
    r'\.dashboard-grid\s*\{[^\}]+\}',
    '.dashboard-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px;}',
    content
)
content = re.sub(
    r'\.lists-grid\s*\{[^\}]+\}',
    '.lists-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(350px, 1fr));gap:20px;flex:1;}',
    content
)

# 2. Add premium hover effects for buttons and cards
premium_css = """
/* Premium Aesthetic Enhancements */
.card, .list-container {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover, .list-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 204, 0, 0.15);
    border-color: var(--primary);
}
.btn, .btn-outline {
    transition: all 0.2s ease;
}
.btn:active, .btn-outline:active {
    transform: scale(0.95);
}
.item-row {
    transition: background 0.2s;
}
.item-row:hover {
    background: rgba(255, 204, 0, 0.1);
}
"""
if 'Premium Aesthetic Enhancements' not in content:
    content = content.replace('</style>', premium_css + '\\n</style>')

# 3. Ensure modals are scrollable on small screens
content = re.sub(
    r'\.modal-content\s*\{([^\}]+)\}',
    r'.modal-content{\g<1>max-height:90vh;overflow-y:auto;}',
    content
)

with open('superadmin.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated superadmin.html successfully")
