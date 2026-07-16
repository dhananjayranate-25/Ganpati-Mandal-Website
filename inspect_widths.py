import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as file:
    lines = file.readlines()
    for i, line in enumerate(lines):
        if 'width:' in line and 'px' in line:
            print(f'Line {i+1}: {line.strip()}')
