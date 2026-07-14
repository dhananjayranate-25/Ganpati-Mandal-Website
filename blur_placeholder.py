import base64
from PIL import Image
import io

def generate_blur_placeholder():
    img_path = 'uploads/hero_banner.jpg'
    img = Image.open(img_path)
    img = img.convert('RGB')
    
    # Resize to tiny dimensions (e.g., 20x10)
    img.thumbnail((20, 10))
    
    # Save to bytes
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG", quality=40)
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    data_uri = f"data:image/jpeg;base64,{img_str}"
    
    return data_uri

def inject_placeholder(data_uri):
    filepath = 'index.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We will inject the background directly into heroSectionContainer style
    target = '<div id="heroSectionContainer" class="hero-section">'
    replacement = f'<div id="heroSectionContainer" class="hero-section" style="background-image: url(\'{data_uri}\'); background-size: cover; background-position: center;">'
    
    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully injected placeholder.")
    else:
        # Check if already injected
        if "data:image/jpeg;base64" in content and "heroSectionContainer" in content:
            print("Already injected?")
        else:
            print("Target not found.")

if __name__ == '__main__':
    uri = generate_blur_placeholder()
    print("Generated URI length:", len(uri))
    inject_placeholder(uri)
