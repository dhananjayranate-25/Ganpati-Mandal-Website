import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'id="niyojanSection"' in line:
        for j in range(i, i+30):
            print(lines[j].strip())
        print('---')
    if 'id="aartiSection"' in line:
        for j in range(i, i+30):
            print(lines[j].strip())
        print('---')
