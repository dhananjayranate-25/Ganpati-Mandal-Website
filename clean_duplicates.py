import re

with open('server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
deleted = 0
put_expense_count = 0
delete_expense_count = 0

for line in lines:
    if "app.put('/api/portal/expenses/:id'" in line:
        put_expense_count += 1
        if put_expense_count > 1:
            skip = True
            deleted += 1
            continue
    elif "app.delete('/api/portal/expenses/:id'" in line:
        delete_expense_count += 1
        if delete_expense_count > 1:
            skip = True
            deleted += 1
            continue
    
    if skip:
        deleted += 1
        if line.strip() == '});':
            skip = False
        continue
    
    new_lines.append(line)

with open('server.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Deleted {deleted} lines of duplicate routes.")
