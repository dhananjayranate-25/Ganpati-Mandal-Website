import io
import sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '${year}' in line or '${rows}' in line:
            print(f'{i+1}: {line.strip()[:200]}')
