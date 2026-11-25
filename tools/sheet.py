"""Contact sheets of review stills: python3 tools/sheet.py <dir> <outprefix> [per=12]"""
import sys, os
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; per = int(sys.argv[3]) if len(sys.argv) > 3 else 12
fs = sorted(f for f in os.listdir(d) if f.endswith('.png') and not f.startswith('._'))
for k in range(0, len(fs), per):
    chunk = fs[k:k + per]; W, H = 640, 360; cols = 3
    sheet = Image.new('RGB', (W * cols, H * ((len(chunk) + cols - 1) // cols)))
    for i, f in enumerate(chunk):
        im = Image.open(os.path.join(d, f)).convert('RGB').resize((W, H))
        ImageDraw.Draw(im).text((8, 6), f[:24], fill=(255, 255, 0))
        sheet.paste(im, ((i % cols) * W, (i // cols) * H))
    sheet.save(f'{out}{k // per}.png'); print(f'{out}{k // per}.png')
