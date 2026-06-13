from PIL import Image

src = "/app/frontend/public/logo-src.png"
im = Image.open(src).convert("RGBA")
px = im.load()
w, h = im.size

# Make near-black background transparent
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if r < 38 and g < 38 and b < 38:
            px[x, y] = (r, g, b, 0)

# Crop to content bounding box (trim transparent padding)
bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

im.save("/app/frontend/public/logo-pnice.png")
print("transparent logo saved", im.size)

# Favicon (square, padded) on transparent
side = max(im.size)
fav = Image.new("RGBA", (side, side), (0, 0, 0, 0))
fav.paste(im, ((side - im.size[0]) // 2, (side - im.size[1]) // 2), im)
fav.resize((256, 256)).save("/app/frontend/public/favicon.png")
print("favicon saved")
