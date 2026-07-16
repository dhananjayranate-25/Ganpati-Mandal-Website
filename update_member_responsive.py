import re

with open('member.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Dashboard Grid (which contains Tasks, Expenses blocks)
content = re.sub(
    r'\.dashboard-grid\s*\{[^\}]+\}',
    '.dashboard-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;}',
    content
)

# 2. Add premium hover effects for buttons and cards
premium_css = """
/* Premium Aesthetic Enhancements */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(255, 204, 0, 0.2);
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

with open('member.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated member.html successfully")
