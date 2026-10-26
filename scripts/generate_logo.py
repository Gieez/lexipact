import math
from PIL import Image, ImageDraw, ImageFont

size = 512
img = Image.new("RGBA", (size, size), (10, 12, 16, 255))
draw = ImageDraw.Draw(img)

center = size // 2

# Background radial gradient / dark layered circle
for r in range(240, 200, -1):
    alpha = int(255 * (r - 200) / 40)
    draw.ellipse(
        [center - r, center - r, center + r, center + r],
        outline=(26, 32, 44, alpha),
        width=1,
    )

# Inner background disc
draw.ellipse(
    [center - 210, center - 210, center + 210, center + 210],
    fill=(17, 20, 26, 255),
    outline=(35, 40, 52, 255),
    width=3,
)

# Gold seal accent ring
draw.ellipse(
    [center - 195, center - 195, center + 195, center + 195],
    outline=(217, 119, 6, 220),
    width=3,
)

# Dashed or notch circle
for deg in range(0, 360, 15):
    rad = math.radians(deg)
    x1 = center + 188 * math.cos(rad)
    y1 = center + 188 * math.sin(rad)
    x2 = center + 192 * math.cos(rad)
    y2 = center + 192 * math.sin(rad)
    draw.line([x1, y1, x2, y2], fill=(245, 158, 11, 200), width=2)

# Central Scale of Justice & Cryptographic Shield Icon
# Central Pillar
pillar_x = center
draw.line([pillar_x, center - 110, pillar_x, center + 100], fill=(243, 241, 234, 255), width=6)
# Pillar base
draw.line([center - 40, center + 100, center + 40, center + 100], fill=(217, 119, 6, 255), width=8)
draw.line([center - 55, center + 110, center + 55, center + 110], fill=(243, 241, 234, 255), width=5)

# Top finial / seal node
draw.ellipse([center - 12, center - 124, center + 12, center - 100], fill=(245, 158, 11, 255))
draw.ellipse([center - 6, center - 118, center + 6, center - 106], fill=(255, 255, 255, 255))

# Balance Beam
beam_y = center - 70
draw.line([center - 110, beam_y, center + 110, beam_y], fill=(245, 158, 11, 255), width=6)
draw.ellipse([center - 115, beam_y - 5, center - 105, beam_y + 5], fill=(255, 255, 255, 255))
draw.ellipse([center + 105, beam_y - 5, center + 115, beam_y + 5], fill=(255, 255, 255, 255))

# Left Pan Strings & Pan
draw.line([center - 110, beam_y, center - 145, beam_y + 65], fill=(139, 148, 158, 220), width=2)
draw.line([center - 110, beam_y, center - 75, beam_y + 65], fill=(139, 148, 158, 220), width=2)
draw.arc([center - 145, beam_y + 45, center - 75, beam_y + 85], start=0, end=180, fill=(217, 119, 6, 255), width=4)
draw.line([center - 145, beam_y + 65, center - 75, beam_y + 65], fill=(245, 158, 11, 255), width=3)

# Right Pan Strings & Pan
draw.line([center + 110, beam_y, center + 75, beam_y + 65], fill=(139, 148, 158, 220), width=2)
draw.line([center + 110, beam_y, center + 145, beam_y + 65], fill=(139, 148, 158, 220), width=2)
draw.arc([center + 75, beam_y + 45, center + 145, beam_y + 85], start=0, end=180, fill=(217, 119, 6, 255), width=4)
draw.line([center + 75, beam_y + 65, center + 145, beam_y + 65], fill=(245, 158, 11, 255), width=3)

# Emerald Cryptographic Shield badge in lower center
shield_w = 46
shield_h = 54
sy = center + 15
sx = center
points = [
    (sx - shield_w // 2, sy),
    (sx + shield_w // 2, sy),
    (sx + shield_w // 2, sy + 25),
    (sx, sy + shield_h),
    (sx - shield_w // 2, sy + 25),
]
draw.polygon(points, fill=(16, 185, 129, 230), outline=(243, 241, 234, 255))
# Inner checkmark
draw.line([sx - 10, sy + 24, sx - 2, sy + 32], fill=(255, 255, 255, 255), width=3)
draw.line([sx - 2, sy + 32, sx + 12, sy + 18], fill=(255, 255, 255, 255), width=3)

img.save("E:/AI-Agent/Workspace/lexipact/public/logo.png", "PNG")
print("Logo generated successfully at public/logo.png")
