"""Measured checks on an encoded film: brightness jumps per frame (flashes), audio offset against the song.
python3 tools/checks.py <film.mp4>"""
import subprocess, sys, json, numpy as np, wave
f = sys.argv[1]; W, H = 96, 54
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', f'scale={W}:{H}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
v = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32); m = v.mean((1, 2)); print('frames', len(m))
cuts = {round(s['from'] * 60) for s in json.load(open('film.json'))['scenes']}
# flash: pairs of opposing luminance changes over 10 % of range on over a quarter of the picture, more than 3 pairs in a second (WCAG style, measured on the area-averaged picture)
d = v[1:] / 255; rel = np.where(v / 255 <= .04045, v / 255 / 12.92, ((v / 255 + .055) / 1.055) ** 2.4)
ext, last = [], rel[0]; state = np.zeros((H, W)); ref = rel[0].copy(); events = []
for i in range(1, len(rel)):
    df = rel[i] - ref; up = df > .1; dn = df < -.1; dark = np.minimum(rel[i], ref) < .8
    a, b = (up & dark).mean(), (dn & dark).mean()
    if a > .25: events.append((i, 1))
    if b > .25: events.append((i, -1))
    ref = np.where(up | dn, rel[i], ref)
ev = []; 
for e in events:
    if not ev or ev[-1][1] != e[1]: ev.append(e)
t = np.array([e[0] for e in ev]) / 60; worst = max([int(((t >= x) & (t < x + 1)).sum()) for x in t] or [0]); print('opposing large brightness changes in any 1 s (6 is three flashes):', worst, [round(float(x), 2) for x in t][:40])
j = np.abs(np.diff(m)); print('largest single-frame jumps away from cuts:', [(round((i + 1) / 60, 2), round(float(j[i]), 1)) for i in np.argsort(-j)[:400] if (i + 1) not in cuts][:8])
print('dark seconds (mean < 12):', sorted({int(i / 60) for i in np.where(m < 12)[0]}))
pcm = lambda p: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float64)
a, b = pcm(f), pcm('media/song.wav'); print('audio seconds', len(a) / 8000, len(b) / 8000)
for at in (30, 170, 320):
    x = a[at * 8000:(at + 8) * 8000]; y = b[at * 8000 - 800:(at + 8) * 8000 + 800]; c = [float(np.dot(x, y[k:k + len(x)])) for k in range(0, 1601)]; k = int(np.argmax(c)); print('audio offset at', at, 's:', (800 - k) / 8, 'ms, correlation', round(c[k] / (np.linalg.norm(x) * np.linalg.norm(y[k:k + len(x)]) + 1e-9), 4))
