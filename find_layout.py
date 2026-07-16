with open('member.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'dashboard-grid' in line or '</main>' in line or 'class="card"' in line:
        print(f"{i}: {line.strip()}")
