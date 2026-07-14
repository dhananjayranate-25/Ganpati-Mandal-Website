import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add preload for logo.jpeg and add fetchpriority to logo.jpeg
old_head = """    <link rel="preload" as="image" href="logo/logo1.jpeg">
    <link rel="preload" as="image" href="uploads/hero_banner.jpg">"""
new_head = """    <link rel="preload" as="image" href="logo/logo1.jpeg">
    <link rel="preload" as="image" href="uploads/hero_banner.jpg">
    <link rel="preload" as="image" href="logo/logo.jpeg">"""

content = content.replace(old_head, new_head)

# 2. Add decoding="async" to hero_banner.jpg
old_hero = """<img id="heroBannerImg" src="uploads/hero_banner.jpg" alt="Ganpati Banner" class="hero-banner-img" style="display: block;" onerror="this.src='images/default-banner.jpg'" fetchpriority="high">"""
new_hero = """<img id="heroBannerImg" src="uploads/hero_banner.jpg" alt="Ganpati Banner" class="hero-banner-img" style="display: block;" onerror="this.src='images/default-banner.jpg'" fetchpriority="high" decoding="async">"""

content = content.replace(old_hero, new_hero)

# 3. Add fetchpriority="high" and decoding="async" to logo.jpeg
old_logo = """<img src="logo/logo.jpeg" id="secretAdminLogo" alt="Shivsrushti Logo" class="ganpati-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🙏%3C/text%3E%3C/svg%3E';this.classList.add('fallback-icon')">"""
new_logo = """<img src="logo/logo.jpeg" id="secretAdminLogo" alt="Shivsrushti Logo" class="ganpati-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🙏%3C/text%3E%3C/svg%3E';this.classList.add('fallback-icon')" fetchpriority="high" decoding="async">"""

content = content.replace(old_logo, new_logo)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
