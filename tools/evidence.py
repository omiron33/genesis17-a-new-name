"""Evidence from the finished film: three worded stills a scene, a 12-frame strip, a 960x540 clip with sound.
python3 tools/evidence.py <film.mp4> <out dir> [ids]"""
import json, subprocess, sys, os
from PIL import Image, ImageDraw
film, out = sys.argv[1:3]; only = sys.argv[3].split(',') if len(sys.argv) > 3 else None; F = json.load(open('film.json'))
for d in ('stills', 'strips', 'clips'): os.makedirs(f'{out}/{d}', exist_ok=True)
ff = lambda *a: subprocess.run(['ffmpeg', '-y', '-v', 'error', *a])
for s in F['scenes']:
    if only and s['id'] not in only: continue
    n, a, b = s['scene'], s['from'], s['to']; c = f'{out}/clips/{n}.mp4'
    ff('-ss', f'{a:.3f}', '-t', f'{b - a:.3f}', '-i', film, '-vf', 'scale=960:540', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', c)
    for k in (0.2, 0.55, 0.93): ff('-ss', f'{a + (b - a) * k:.3f}', '-i', film, '-frames:v', '1', '-q:v', '3', f'{out}/stills/{n}-{int(k * 100)}.jpg')
    W, H = 384, 216; strip = Image.new('RGB', (W * 6, H * 2 + 16)); ImageDraw.Draw(strip).text((4, 2), f'{n}  {a:.1f}-{b:.1f}', fill=(255, 255, 0))
    for i in range(12):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{(b - a) * (i + 0.5) / 12:.3f}', '-i', c, '-frames:v', '1', '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
        if len(raw) == W * H * 3: strip.paste(Image.frombytes('RGB', (W, H), raw), (i % 6 * W, 16 + i // 6 * H))
    strip.save(f'{out}/strips/{n}.jpg', quality=88)
