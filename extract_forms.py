import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Just print the exact HTML for Aarti form
print('--- AARTI ---')
aarti_start = content.find('<div id="tab-aarti"')
if aarti_start != -1:
    aarti_end = content.find('</form>', aarti_start)
    print(content[aarti_start:aarti_end+7])

print('--- NIYOJAN ---')
niyojan_start = content.find('<div id="tab-niyojan"')
if niyojan_start != -1:
    niyojan_end = content.find('</form>', niyojan_start)
    print(content[niyojan_start:niyojan_end+7])
