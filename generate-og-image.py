"""
Generate High-Quality 1200x630 og-image.webp for YUKTI '27
Incorporating:
- YUKTI '27 branding
- INTANGIBLES theme
- Thiagarajar School of Management (TSM), Madurai branding
- Verified event dates (January 28, 29 & 30, 2027) & Grand Bounty ₹20,00,000
- Official crests & logos
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

width = 1200
height = 630

# Create base canvas with Royal Purple dark gradient
base = Image.new('RGBA', (width, height), (11, 5, 20, 255))
draw = ImageDraw.Draw(base)

# Create radial gradient glow
glow_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow_layer)

# Central / Top radial glow #4D1D64
for r in range(450, 0, -15):
    alpha = int(45 * (1 - r / 450))
    glow_draw.ellipse(
        [width//2 - r*1.4, 180 - r*0.7, width//2 + r*1.4, 180 + r*0.7],
        fill=(77, 29, 100, alpha)
    )

# Bottom corner gold glow #C59B3C
for r in range(350, 0, -15):
    alpha = int(35 * (1 - r / 350))
    glow_draw.ellipse(
        [width - 150 - r, height - 100 - r, width - 150 + r, height - 100 + r],
        fill=(197, 155, 60, alpha)
    )

base = Image.alpha_composite(base, glow_layer)
draw = ImageDraw.Draw(base)

# Draw elegant borders (1px gold inset frame)
inset = 24
draw.rounded_rectangle(
    [inset, inset, width - inset, height - inset],
    radius=18,
    outline=(197, 155, 60, 90),
    width=2
)

# Paste Official YUKTI Logo and TSM Crest
try:
    yukti_logo = Image.open('public/yukti-logo.png').convert('RGBA')
    yukti_logo.thumbnail((120, 120), Image.Resampling.LANCZOS)
    base.paste(yukti_logo, (60, 55), yukti_logo)
except Exception as e:
    print('Yukti logo error:', e)

try:
    tsm_logo = Image.open('public/tsm-logo.png').convert('RGBA')
    tsm_logo.thumbnail((110, 110), Image.Resampling.LANCZOS)
    base.paste(tsm_logo, (width - 170, 60), tsm_logo)
except Exception as e:
    print('TSM logo error:', e)

# Typography using default/truetype font
try:
    # Try common Windows fonts
    font_large = ImageFont.truetype("arialbd.ttf", 68)
    font_subtitle = ImageFont.truetype("arialbd.ttf", 32)
    font_tagline = ImageFont.truetype("arial.ttf", 22)
    font_meta = ImageFont.truetype("arialbd.ttf", 20)
    font_badge = ImageFont.truetype("arialbd.ttf", 16)
except Exception:
    font_large = ImageFont.load_default()
    font_subtitle = font_large
    font_tagline = font_large
    font_meta = font_large
    font_badge = font_large

# Top Organiser Label
draw.text(
    (200, 68),
    "THIAGARAJAR SCHOOL OF MANAGEMENT (TSM) · MADURAI",
    font=font_badge,
    fill=(245, 215, 127) # #F5D77F
)
draw.text(
    (200, 96),
    "NAAC A+ & NBA ACCREDITED B-SCHOOL · FOUNDED 1962",
    font=font_tagline,
    fill=(166, 156, 180) # #a69cb4
)

# Title: YUKTI '27
draw.text(
    (60, 210),
    "YUKTI ’27",
    font=font_large,
    fill=(255, 242, 166) # #FFF2A6 Bright Spark
)

# Theme: INTANGIBLES · INFINITE POSSIBILITIES
draw.text(
    (60, 290),
    "INTANGIBLES — INFINITE POSSIBILITIES",
    font=font_subtitle,
    fill=(245, 215, 127) # #F5D77F
)

# Subcaption
draw.text(
    (60, 345),
    "Pan-India Annual Management & Cultural Confluence · 12 National Arenas",
    font=font_tagline,
    fill=(226, 217, 235)
)

# Bottom Highlight Cards
# Card 1: Grand Bounty ₹20,00,000
card1_box = [60, 430, 420, 560]
draw.rounded_rectangle(card1_box, radius=12, fill=(31, 14, 44, 220), outline=(197, 155, 60, 160), width=1)
draw.text((80, 448), "CUMULATIVE NATIONAL BOUNTY", font=font_badge, fill=(245, 215, 127))
draw.text((80, 480), "₹20,00,000", font=font_subtitle, fill=(255, 242, 166))
draw.text((80, 524), "12 Flagship Arenas & Rolling Shields", font=ImageFont.truetype("arial.ttf", 15), fill=(166, 156, 180))

# Card 2: Dates & Venue
card2_box = [440, 430, 800, 560]
draw.rounded_rectangle(card2_box, radius=12, fill=(31, 14, 44, 220), outline=(197, 155, 60, 160), width=1)
draw.text((460, 448), "CONFERENCE DATES & LOCATION", font=font_badge, fill=(245, 215, 127))
draw.text((460, 480), "January 28, 29 & 30, 2027", font=ImageFont.truetype("arialbd.ttf", 26), fill=(255, 255, 255))
draw.text((460, 524), "TSM Campus, Thiruparankundram, Madurai", font=ImageFont.truetype("arial.ttf", 15), fill=(166, 156, 180))

# Card 3: Delegate Attendance
card3_box = [820, 430, 1140, 560]
draw.rounded_rectangle(card3_box, radius=12, fill=(31, 14, 44, 220), outline=(197, 155, 60, 160), width=1)
draw.text((840, 448), "DELEGATION IMPACT", font=font_badge, fill=(245, 215, 127))
draw.text((840, 480), "1,800+ Delegates", font=ImageFont.truetype("arialbd.ttf", 26), fill=(255, 255, 255))
draw.text((840, 524), "60+ Premier B-Schools Pan-India", font=ImageFont.truetype("arial.ttf", 15), fill=(166, 156, 180))

# Save WebP and PNG
base_rgb = base.convert('RGB')
base_rgb.save('public/og-image.webp', 'WEBP', quality=92, method=6)
base_rgb.save('public/og-image.png', 'PNG', optimize=True)
print("Saved og-image.webp and og-image.png successfully!")
