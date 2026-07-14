from PIL import Image

def optimize_image():
    img_path = 'uploads/hero_banner.jpg'
    out_path = 'uploads/hero_banner.jpg' # we'll replace the existing one to keep HTML intact, but compress it heavily as progressive JPEG
    
    img = Image.open(img_path)
    # Convert to RGB (in case it's RGBA)
    img = img.convert('RGB')
    
    # Save as progressive JPEG with optimized quality
    img.save(out_path, 'JPEG', quality=65, optimize=True, progressive=True)
    
    # Let's also do the logo images just in case
    for logo in ['logo/logo.jpeg', 'logo/logo1.jpeg']:
        try:
            l_img = Image.open(logo)
            l_img = l_img.convert('RGB')
            l_img.save(logo, 'JPEG', quality=65, optimize=True, progressive=True)
        except Exception as e:
            print(f"Failed to optimize {logo}: {e}")

if __name__ == '__main__':
    optimize_image()
    print("Images optimized successfully.")
