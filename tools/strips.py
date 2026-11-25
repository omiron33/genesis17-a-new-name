"""Time strips: 10 frames across each quarter-size clip, in one row per scene, five scenes per sheet.
python3 tools/strips.py <segments dir> <out dir> [ids]"""
import json, subprocess, sys, os
from PIL import Image, ImageDraw
F = json.load(open('film.json')); src, out = sys.argv[1], sys.argv[2]; only = sys.argv[3].split(',') if len(sys.argv) > 3 else None; os.makedirs(out, exist_ok=True)
rows = []
for s in F['scenes']:
    if only and s['id'] not in only: continue
    f = next((p for p in (f"{src}/{s['id']}.plate.mp4", f"{src}/{s['id']}.mp4") if os.path.exists(p)), None)
    if not f: continue
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f])); W, H = 288, 162; strip = Image.new('RGB', (W * 10, H + 16))
    ImageDraw.Draw(strip).text((4, 2), f"{s['scene']}  {s['from']:.1f}-{s['to']:.1f}", fill=(255, 255, 0))
    for i in range(10):
        t = d * (i + 0.5) / 10; raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', f, '-frames:v', '1', '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        if len(raw) == W * H * 3: strip.paste(Image.frombytes('RGB', (W, H), raw), (i * W, 16))
    strip.save(f"{out}/{s['scene']}.jpg", quality=88); rows.append((s['scene'], strip))
per = 12
for k in range(0, len(rows), per):
    ch = rows[k:k + per]; sh = Image.new('RGB', (ch[0][1].width, ch[0][1].height * len(ch)))
    for i, (_, im) in enumerate(ch): sh.paste(im, (0, i * im.height))
    sh.save(f'{out}/sheet{k // per}.jpg', quality=86); print(f'{out}/sheet{k // per}.jpg')
