import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_star(draw, center_x, center_y, size, fill):
    """Draw a clean 5-point star"""
    import math
    points = []
    for i in range(10):
        r = size if i % 2 == 0 else size / 2.2
        angle = i * math.pi / 5 - math.pi / 2
        x = center_x + r * math.cos(angle)
        y = center_y + r * math.sin(angle)
        points.append((x, y))
    draw.polygon(points, fill=fill)

def draw_checkmark(draw, x, y, size, fill, width=2):
    """Draw a crisp vector checkmark"""
    p1 = (x, y + size * 0.55)
    p2 = (x + size * 0.35, y + size * 0.9)
    p3 = (x + size, y + size * 0.15)
    draw.line([p1, p2], fill=fill, width=width)
    draw.line([p2, p3], fill=fill, width=width)

def create_exclusive_og_image():
    width = 1200
    height = 630
    
    bg_path = 'public/images/executive_fleet_banner.jpg'
    logo_path = 'public/images/la_travel_logo.jpg'
    output_path = 'public/images/og_share_preview.jpg'
    
    if not os.path.exists(bg_path):
        print(f"Error: {bg_path} not found")
        return

    # 1. Load and crop/scale background image
    src_img = Image.open(bg_path).convert('RGBA')
    src_w, src_h = src_img.size
    
    target_ratio = width / height
    src_ratio = src_w / src_h
    
    if src_ratio > target_ratio:
        new_w = int(src_h * target_ratio)
        offset_x = (src_w - new_w) // 2
        crop_box = (offset_x, 0, offset_x + new_w, src_h)
    else:
        new_h = int(src_w / target_ratio)
        offset_y = int((src_h - new_h) * 0.35)
        crop_box = (0, offset_y, src_w, offset_y + new_h)
        
    cropped_bg = src_img.crop(crop_box).resize((width, height), Image.Resampling.LANCZOS)
    
    # 2. Add subtle vignette / gradient scrims
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # Top gradient scrim for header readability (y: 0 to 180)
    for y in range(180):
        alpha = int(190 * (1 - (y / 180) ** 1.4))
        overlay_draw.line([(0, y), (width, y)], fill=(6, 8, 12, alpha))
        
    # Bottom gradient scrim for bottom card grounding (y: 380 to 630)
    for y in range(380, height):
        progress = (y - 380) / (height - 380)
        alpha = int(210 * (progress ** 1.2))
        overlay_draw.line([(0, y), (width, y)], fill=(5, 7, 10, alpha))
        
    base = Image.alpha_composite(cropped_bg, overlay)
    
    # 3. Fonts
    bold_font_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    regular_font_path = '/System/Library/Fonts/Supplemental/Arial.ttf'
    
    font_brand = ImageFont.truetype(bold_font_path, 36)
    font_brand_sub = ImageFont.truetype(bold_font_path, 14)
    font_pill = ImageFont.truetype(bold_font_path, 15)
    font_headline = ImageFont.truetype(bold_font_path, 28)
    font_features = ImageFont.truetype(bold_font_path, 17)
    font_phone = ImageFont.truetype(bold_font_path, 20)
    font_domain = ImageFont.truetype(bold_font_path, 21)
    font_tag = ImageFont.truetype(bold_font_path, 14)
    
    draw = ImageDraw.Draw(base)
    
    # Luxury colors
    GOLD = (220, 182, 95, 255)         # Champagne Gold
    GOLD_LIGHT = (248, 225, 160, 255)
    WHITE = (255, 255, 255, 255)
    GRAY_TEXT = (215, 222, 235, 255)
    GREEN_WA = (37, 211, 102, 255)
    
    # 4. Top Accent bar (champagne gold with subtle fade)
    for x in range(width):
        t = abs(x - width / 2) / (width / 2)
        alpha = int(255 * (1 - t * 0.3))
        draw.line([(x, 0), (x, 3)], fill=(220, 182, 95, alpha))
        
    # 5. Header: Logo + Brand
    logo_x = 55
    logo_y = 30
    logo_size = 74
    
    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path).convert('RGBA')
        logo_img = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Circular mask
        mask = Image.new('L', (logo_size, logo_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, logo_size, logo_size), fill=255)
        
        # Draw outer subtle glow/ring
        draw.ellipse([logo_x - 3, logo_y - 3, logo_x + logo_size + 3, logo_y + logo_size + 3], outline=(220, 182, 95, 220), width=2)
        base.paste(logo_img, (logo_x, logo_y), mask)
        
    text_x = logo_x + logo_size + 20
    # Brand Name with drop shadow
    draw.text((text_x + 1, logo_y + 8), "L.A TRAVEL BATAM", font=font_brand, fill=(0, 0, 0, 200))
    draw.text((text_x, logo_y + 7), "L.A TRAVEL BATAM", font=font_brand, fill=WHITE)
    
    # Subtitle
    draw.text((text_x, logo_y + 48), "PREMIER VIP CAR RENTAL & TOUR SERVICES", font=font_brand_sub, fill=GOLD)
    
    # Top-right Pill Badge (Glassmorphic)
    pill_w = 265
    pill_h = 42
    pill_x = width - 55 - pill_w
    pill_y = 45
    
    glass_pill = Image.new('RGBA', (pill_w, pill_h), (16, 20, 30, 205))
    glass_pill_draw = ImageDraw.Draw(glass_pill)
    glass_pill_draw.rounded_rectangle([(0, 0), (pill_w - 1, pill_h - 1)], radius=21, outline=(220, 182, 95, 180), width=1)
    
    # Draw vector gold star inside glass pill
    draw_star(glass_pill_draw, 24, 21, 8, GOLD_LIGHT)
    glass_pill_draw.text((40, 12), "VIP FLEET & CHAUFFEUR", font=font_pill, fill=GOLD_LIGHT)
    base.paste(glass_pill, (pill_x, pill_y), glass_pill)
    
    # 6. Bottom Floating Glass Card
    card_x = 55
    card_y = 455
    card_w = width - 110 # 1090 px
    card_h = 142
    
    card_box = (card_x, card_y, card_x + card_w, card_y + card_h)
    crop_for_blur = base.crop(card_box).filter(ImageFilter.GaussianBlur(radius=16))
    
    # Tint layer
    card_tint = Image.new('RGBA', (card_w, card_h), (10, 14, 20, 230))
    tinted_card = Image.alpha_composite(crop_for_blur, card_tint)
    
    card_mask = Image.new('L', (card_w, card_h), 0)
    card_mask_draw = ImageDraw.Draw(card_mask)
    card_mask_draw.rounded_rectangle([(0, 0), (card_w, card_h)], radius=20, fill=255)
    
    base.paste(tinted_card, (card_x, card_y), card_mask)
    
    # Fine Gold border on card
    card_border = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    cb_draw = ImageDraw.Draw(card_border)
    cb_draw.rounded_rectangle([(0, 0), (card_w - 1, card_h - 1)], radius=20, outline=(220, 182, 95, 160), width=1)
    base.paste(card_border, (card_x, card_y), card_border)
    
    card_draw = ImageDraw.Draw(base)
    
    # Row 1: Headline & Fleet badge
    card_draw.text((card_x + 35, card_y + 18), "Rental Mobil Mewah & Terpercaya di Batam", font=font_headline, fill=WHITE)
    
    # Fleet highlight pill on right of row 1
    fleet_tag = "Alphard • Zenix • Fortuner • HiAce • Veloz"
    card_draw.text((card_x + 680, card_y + 26), fleet_tag, font=font_tag, fill=GOLD)
    
    # Row 2: Features with vector checkmarks
    fx = card_x + 35
    fy = card_y + 58
    
    # Feature 1
    draw_checkmark(card_draw, fx, fy + 4, 13, GOLD, width=2)
    card_draw.text((fx + 20, fy), "Lepas Kunci 24 Jam", font=font_features, fill=GRAY_TEXT)
    
    # Feature 2
    fx2 = fx + 230
    draw_checkmark(card_draw, fx2, fy + 4, 13, GOLD, width=2)
    card_draw.text((fx2 + 20, fy), "Include Supir VIP", font=font_features, fill=GRAY_TEXT)
    
    # Feature 3
    fx3 = fx2 + 210
    draw_checkmark(card_draw, fx3, fy + 4, 13, GOLD, width=2)
    card_draw.text((fx3 + 20, fy), "Free Antar-Jemput Bandara & Ferry", font=font_features, fill=GRAY_TEXT)
    
    # Feature 4
    fx4 = fx3 + 345
    draw_checkmark(card_draw, fx4, fy + 4, 13, GOLD, width=2)
    card_draw.text((fx4 + 20, fy), "Unit Bersih & Terawat", font=font_features, fill=GRAY_TEXT)
    
    # Row 3: Contact Pill & Website
    wa_y = card_y + 98
    # WhatsApp icon glowing dot + text
    card_draw.ellipse([card_x + 35, wa_y + 5, card_x + 49, wa_y + 19], fill=GREEN_WA)
    card_draw.text((card_x + 60, wa_y), "WhatsApp Fast Booking: +62 877-9763-1578", font=font_phone, fill=WHITE)
    
    # Website on right
    web_text = "latravelbatam.com"
    card_draw.text((card_x + 885, wa_y), web_text, font=font_domain, fill=GOLD_LIGHT)
    
    # 7. Convert and save as high-quality JPEG
    rgb_result = base.convert('RGB')
    rgb_result.save(output_path, 'JPEG', quality=93, optimize=True)
    
    print(f"✅ Generated Exclusive OG Share Image: {output_path} ({os.path.getsize(output_path) / 1024:.1f} KB)")

if __name__ == '__main__':
    create_exclusive_og_image()
