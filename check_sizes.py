import os
def get_size(path):
    return os.path.getsize(path) / (1024 * 1024) if os.path.exists(path) else 0

print(f"hero_banner.jpg: {get_size('uploads/hero_banner.jpg'):.2f} MB")
print(f"logo.jpeg: {get_size('logo/logo.jpeg'):.2f} MB")
print(f"logo1.jpeg: {get_size('logo/logo1.jpeg'):.2f} MB")
