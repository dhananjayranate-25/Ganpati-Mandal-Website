with open('index.html', 'r', encoding='utf-8') as f:
    for line in f:
        if 'niyojan-card' in line or 'aarti-card' in line:
            print(line.strip())
