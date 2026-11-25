"""Pair each re-rendered scene with its version-1 picture at the same moments: v1 on top, v2 below.
python3 tools/compare.py <v1 film.mp4> <v2 segments dir> <out dir> ids"""
import json, subprocess, sys, os
from PIL import Image, ImageDraw
v1, seg, out, ids = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(','); os.makedirs(out, exist_ok=True); F = {s['id']: s for s in json.load(open('film.json'))['scenes']}; W, H = 480, 270
def fr(path, t):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', path, '-frames:v', '1', '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    return Image.frombytes('RGB', (W, H), raw) if len(raw) == W * H * 3 else Image.new('RGB', (W, H))
for id in ids:
    s = F[id]; a, b = s['from'], s['to']; sh = Image.new('RGB', (W * 4, H * 2 + 18)); d = ImageDraw.Draw(sh); d.text((4, 3), f"{s['scene']}  (v1 film above, v2 picture below)", fill=(255, 255, 0))
    for i, k in enumerate((0.12, 0.4, 0.68, 0.94)):
        t = (b - a) * k; sh.paste(fr(v1, a + t), (i * W, 18)); sh.paste(fr(f'{seg}/{id}.plate.mp4', t), (i * W, 18 + H))
    sh.save(f"{out}/{s['scene']}.jpg", quality=88)
