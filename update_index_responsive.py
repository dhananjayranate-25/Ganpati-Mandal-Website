import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix cover-logo-wrap and cover-divider
content = re.sub(r'\.cover-logo-wrap\s*\{([^\}]+)width:\s*350px;', r'.cover-logo-wrap{\g<1>width:350px;max-width:90vw;', content)
content = re.sub(r'\.cover-divider\s*\{([^\}]+)width:\s*350px;', r'.cover-divider{\g<1>width:350px;max-width:80vw;', content)

# 2. Fix Event Grid Layout
content = re.sub(
    r'\.events-grid\s*\{[^\}]+\}',
    '.events-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:25px;margin-top:20px;}',
    content
)

# 3. Fix Committee Grid Layout (it was horizontal scroll on mobile, let's keep it fluid grid if we want, or side scrolling? User wants premium, let's make it a fluid grid but with minmax 150px so we fit 2 on mobile)
content = re.sub(
    r'\.committee-grid\s*\{[^\}]+\}',
    '.committee-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:20px;justify-content:center;}',
    content
)

# 4. Expense Grid Layout
content = re.sub(
    r'\.expense-grid\s*\{[^\}]+\}',
    '.expense-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:20px;}',
    content
)

# 5. Add premium card hover effects globally
premium_css = """
/* Premium Aesthetic Enhancements */
.event-card, .committee-card, .expense-card {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}
.event-card:hover, .committee-card:hover, .expense-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.1) inset;
    border-color: var(--primary-color);
}
.committee-card:hover img {
    transform: scale(1.05);
}
.btn, .action-btn {
    transition: all 0.2s ease;
}
.btn:active, .action-btn:active {
    transform: scale(0.95);
}
"""
if 'Premium Aesthetic Enhancements' not in content:
    content = content.replace('</style>', premium_css + '\\n</style>')

# 6. Check for @media (max-width: 768px) and refine it
# Let's just ensure body padding isn't excessive on mobile.
content = re.sub(
    r'padding:\s*40px\s*20px;',
    'padding:40px 15px;',
    content
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html successfully")
