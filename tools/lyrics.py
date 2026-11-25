"""One lyric layer per scene: where the line sits and in what ink. python3 tools/lyrics.py"""
import json
F = json.load(open('film.json'))
BONE = "'246, 240, 226'"; DARK = "'40, 26, 16'"
# sy: -1 bottom .. 1 top; frac: width of the plane; opt: extra fields
D = dict(sy=-0.70, sx=0, frac=0.74, shade=0.5, aspect=3)
O = {}
def o(name, **k): O[name] = k
exec(open('tools/lyric_layout.py').read())
for s in F['scenes']:
    n = s['scene']; k = {**D, **O.get(n[:3], {})}
    ink = k.pop('ink', None); extra = k.pop('extra', None); body = ', '.join(f'{a}: {json.dumps(b)}' for a, b in k.items())
    if ink: body += f', ink: {ink}'
    if extra: body += f', {extra}'
    open(f'scenes/{n}.lyric.js', 'w').write(f"// The words of {n}, on a plane that travels with its camera.\nimport scene from '/song/scenes/{n}.js';\nimport {{ layer, gauge, titleCard, ease }} from '/song/lib/type.js';\n\nexport default (P) => layer(P, scene(P), {{ {body} }});\n")
print(len(F['scenes']), 'lyric layers')
