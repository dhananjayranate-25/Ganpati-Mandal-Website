import sys, io, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

files = ['index.html', 'member.html', 'superadmin.html']
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        print(f'\\n=== {f} ===')
        
        # Print block of media queries
        lines = content.split('\\n')
        in_media = False
        media_buffer = []
        brace_count = 0
        
        for line in lines:
            if '@media' in line:
                in_media = True
                media_buffer.append(line)
                brace_count += line.count('{') - line.count('}')
            elif in_media:
                media_buffer.append(line)
                brace_count += line.count('{') - line.count('}')
                if brace_count <= 0:
                    in_media = False
                    print('\\n'.join(media_buffer[:5]) + '...\\n}')
                    media_buffer = []
