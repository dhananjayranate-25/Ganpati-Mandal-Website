target = """.footer-mandal-name-img {
    width: 100%;
    max-width: 650px; /* Allow wider stretch */
    height: 95px; /* Keep height strictly locked */
    object-fit: fill; /* Horizontally stretch the image to the right */
    object-position: left center;
    mix-blend-mode: multiply;
}"""

replacement = """.footer-mandal-name-img {
    width: calc(100% + 120px);
    margin-left: -120px;
    max-width: 850px; /* Allow wider stretch */
    height: 95px; /* Keep height strictly locked */
    object-fit: fill; /* Horizontally stretch the image to the right */
    object-position: left center;
    mix-blend-mode: multiply;
}"""

with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

if target in text:
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(text.replace(target, replacement))
    print('Replaced successfully')
else:
    print('Target not found')
