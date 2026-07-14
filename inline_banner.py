import base64
import os

def inline_hero_image():
    img_path = 'uploads/hero_banner.jpg'
    html_path = 'index.html'
    
    with open(img_path, 'rb') as f:
        img_data = f.read()
        
    b64_str = base64.b64encode(img_data).decode('utf-8')
    data_uri = f"data:image/jpeg;base64,{b64_str}"
    
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We want to replace the src of heroBannerImg
    # `<img id="heroBannerImg" src="uploads/hero_banner.jpg"`
    target = 'src="uploads/hero_banner.jpg"'
    replacement = f'src="{data_uri}"'
    
    if target in content:
        # We should also remove the opacity and onload stuff since it's inline now
        content = content.replace(target, replacement)
        
        # Remove the onload and opacity
        content = content.replace('style="display: block; opacity: 0; transition: opacity 0.3s ease-in-out;" onload="this.style.opacity=1"', 'style="display: block;"')
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully inlined full image!")
    else:
        print("Target not found")

if __name__ == '__main__':
    inline_hero_image()
