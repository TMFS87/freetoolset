from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
c1 = (167, 139, 250)   # brand purple
c2 = (13, 17, 23)      # dark

img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    t = y / (H - 1)
    r = int(c1[0] + (c2[0] - c1[0]) * t)
    g = int(c1[1] + (c2[1] - c1[1]) * t)
    b = int(c1[2] + (c2[2] - c1[2]) * t)
    for x in range(W):
        px[x, y] = (r, g, b)

d = ImageDraw.Draw(img)

candidates = [
    "C:/Windows/Fonts/msyhbd.ttc",
    "C:/Windows/Fonts/msyh.ttc",
    "C:/Windows/Fonts/arial.ttf",
]
def load(sz):
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, sz)
            except Exception:
                pass
    return ImageFont.load_default()

font_big = load(76)
font_mid = load(42)
font_small = load(30)

# soft accent bar
d.rectangle([80, 170, 110, 250], fill=(244, 114, 182))

d.text((130, 180), "FreeToolset", font=font_big, fill=(255, 255, 255))
d.text((84, 300), "95+ free online tools · ready to use", font=font_mid, fill=(230, 237, 243))
d.text((84, 372), "AI Writing · Developer Tools · Image Tools · Text Conversion", font=font_small, fill=(157, 167, 179))
d.text((84, 470), "freetoolset.app", font=font_small, fill=(167, 139, 250))

img.save("og-image.png")
print("saved og-image.png", img.size)
