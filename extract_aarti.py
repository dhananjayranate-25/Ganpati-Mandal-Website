import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

aarti_form_start = content.find('<form id="addAartiForm"')
if aarti_form_start != -1:
    aarti_form_end = content.find('</form>', aarti_form_start)
    print(content[aarti_form_start:aarti_form_end+7])
