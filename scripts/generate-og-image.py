import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_og_image():
    width = 1200
    height = 630
    
    # 1. Base image from hero background
    hero_path = 'public/images/hero_la_transport_1790686468335.jpg'
    logo_path = 'public/images/la_travel_logo.jpg'
    car_path = 'public/images/cars/toyota-innova-zenix.jpg'
    output_path = 'public/images/og_share_preview.jpg'
    
    if os.path.exists(hero_path):
        base_img = Image.open(hero_path).convert('RGBA')
        # Resize and crop to 1200x630
        base_img = base_img.resize((width, height), Image.Resampling.LANCZOS)
    else:
        base_img = Image.new('RGBA', (width, height), (15, 15, 18, 255))
        
    # Dark gradient scrim over the background for contrast
    scrim = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    scrim_draw = ImageDraw.Draw(scrim)
    
    # Fill with deep black gradient from left to right
    for x in range(width):
        # Left 65% is very dark (for high contrast text), fading slightly to right
        if x < 750:
            alpha = int(240 - (x / 750) * 45) # 240 down to 195
        else:
            alpha = int(195 - ((x - 750) / (width - 750)) * 60) # down to 135
        scrim_draw.line([(x, 0), (x, height)], fill=(10, 10, 12, alpha))
        
    combined = Image.alpha_composite(base_img, scrim)
    
    # Add a luxury gold top/bottom border bar
    draw = ImageDraw.Draw(combined)
    draw.rectangle([(0, 0), (width, 8)], fill=(212, 175, 55, 255)) # Gold top accent
    draw.rectangle([(0, height - 8), (width, height)], fill=(212, 175, 55, 255)) # Gold bottom accent

    # Load system fonts
    font_paths = [
        '/System/Library/Fonts/Helvetica.ttc',
        '/Library/Fonts/Arial.ttf',
        '/System/Library/Fonts/SFNS.ttf'
    ]
    font_bold = None
    font_title = None
    font_sub = None
    font_badge = None
    font_small = None
    
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                font_title = ImageFont.truetype(fp, 56)
                font_sub = ImageFont.truetype(fp, 28)
                font_badge = ImageFont.truetype(fp, 23)
                font_small = ImageFont.truetype(fp, 20)
                font_bold = ImageFont.truetype(fp, 36)
                break
            except Exception:
                continue
                
    if not font_title:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_bold = ImageFont.load_default()

    # 2. Paste circular official Logo
    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path).convert('RGBA')
        logo_size = 110
        logo_img = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Make circular mask
        mask = Image.new('L', (logo_size, logo_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, logo_size, logo_size), fill=255)
        
        # Paste logo
        logo_x = 70
        logo_y = 55
        combined.paste(logo_img, (logo_x, logo_y), mask)
        
        # Draw gold ring around logo
        draw.ellipse([logo_x - 3, logo_y - 3, logo_x + logo_size + 3, logo_y + logo_size + 3], outline=(212, 175, 55, 255), width=3)
        
        text_x = logo_x + logo_size + 30
        text_y = logo_y + 12
    else:
        text_x = 70
        text_y = 65

    # Brand Title
    draw.text((text_x, text_y), "L.A TRAVEL BATAM", font=font_title, fill=(245, 245, 247, 255))
    draw.text((text_x, text_y + 60), "RENTAL MOBIL & TOUR WISATA BATAM", font=font_sub, fill=(212, 175, 55, 255))

    # Main Headline
    headline_y = 210
    draw.text((70, headline_y), "Sewa Mobil Nyaman, Bersih & Terpercaya", font=font_bold, fill=(255, 255, 255, 255))
    
    # Value points with checkmark icons
    features = [
      "✓  Lepas Kunci 24 Jam  |  Pilihan Include Supir & BBM",
      "✓  Gratis Antar-Jemput Pelabuhan Ferry & Bandara Hang Nadim",
      "✓  Armada Prima: Alphard VIP, Zenix Hybrid, Veloz, HiAce",
      "✓  Pilihan Utama Wisatawan Lokal, Singapura & Malaysia"
    ]
    
    start_y = headline_y + 60
    for idx, feat in enumerate(features):
        fy = start_y + (idx * 44)
        # Highlight checkmark in gold
        draw.text((70, fy), feat, font=font_badge, fill=(229, 229, 234, 255))

    # Bottom Contact Bar Container
    bar_y = 490
    bar_h = 80
    draw.rectangle([(70, bar_y), (1130, bar_y + bar_h)], fill=(28, 28, 32, 220), outline=(212, 175, 55, 150), width=2)
    
    # Bottom text
    draw.text((95, bar_y + 16), "🟢 Fast Booking WhatsApp: +62 877-9763-1578", font=font_badge, fill=(37, 211, 102, 255))
    draw.text((95, bar_y + 46), "📍 Ruko Taman Eden Park No.19, Kota Batam", font=font_small, fill=(160, 160, 170, 255))
    draw.text((820, bar_y + 26), "🌐 latravelbatam.com", font=font_badge, fill=(212, 175, 55, 255))

    # Convert to RGB and save as high-quality JPEG
    rgb_img = combined.convert('RGB')
    rgb_img.save(output_path, 'JPEG', quality=90, optimize=True)
    print(f"✅ Generated OG share image successfully: {output_path} ({os.path.getsize(output_path) / 1024:.1f} KB)")

if __name__ == '__main__':
    create_og_image()
