with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("Dhananjay Ranate</div></div></div></div></body></html>\\';", "Dhananjay Ranate</div></div></div></div></body></html>`;")
text = text.replace("Dhananjay Ranate</div></div></div></div></body></html>;", "Dhananjay Ranate</div></div></div></div></body></html>`;")
text = text.replace("Dhananjay Ranate</div></div></div></div></body></html>';", "Dhananjay Ranate</div></div></div></div></body></html>`;")

text = text.replace("return '<!DOCTYPE html>", "return `<!DOCTYPE html>")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done fixing backtick.')
