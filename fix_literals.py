import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    line = lines[i]
    if ('${year}' in line or '${rows}' in line) and "'" in line:
        # If the line is an assignment or append to innerHTML, html, a.download etc.
        # We replace the outer single quotes with backticks.
        if "container.innerHTML = '" in line:
            lines[i] = line.replace("container.innerHTML = '", "container.innerHTML = `").replace("';\n", "`;\n")
        elif "html += '" in line:
            lines[i] = line.replace("html += '", "html += `").replace("';\n", "`;\n")
        elif "await generatePDFFromHTML(html, true, '" in line:
            lines[i] = line.replace("'Cashbook_${year}.pdf'", "`Cashbook_${year}.pdf`")
        elif "a.download = 'Ganpati_Cashbook_${year}.pdf';" in line:
            lines[i] = line.replace("'Ganpati_Cashbook_${year}.pdf'", "`Ganpati_Cashbook_${year}.pdf`")

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)
