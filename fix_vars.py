with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix logoSrc
content = content.replace("url('' + logoSrc + '')", "url('${logoSrc}')")
content = content.replace("url('\\'' + logoSrc + '\\'')", "url('${logoSrc}')")

# Also fix other variables in createCoverHTML that I might have broken with string concatenation
content = content.replace("' + (s.orgName.includes", "${(s.orgName.includes")
content = content.replace(": s.orgName) + '", ": s.orgName}")

content = content.replace("' + s.subtitle + '", "${s.subtitle}")
content = content.replace("' + s.tagline + '", "${s.tagline}")
content = content.replace("' + year + '", "${year}")
content = content.replace("' + (s.headerOrgName || s.orgName) + '", "${s.headerOrgName || s.orgName}")
content = content.replace("' + (s.headerSubtitle || s.subtitle) + '", "${s.headerSubtitle || s.subtitle}")
content = content.replace("' + formatPDFCurrency(totalCashIn) + '", "${formatPDFCurrency(totalCashIn)}")
content = content.replace("' + formatPDFCurrency(totalCashOut) + '", "${formatPDFCurrency(totalCashOut)}")
content = content.replace("' + formatPDFCurrency(finalBalance) + '", "${formatPDFCurrency(finalBalance)}")
content = content.replace("' + rows + '", "${rows}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
