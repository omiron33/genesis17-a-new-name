"""Evidence notes for data/lyrics.json (no hand changes were needed): two local CTC models agree within
0.15 s on 544 of 550 words; the take repeats "from foreigners" at 348 s, so intake/sung-lyrics.txt has that
line twice (the voice is in the separated stem there, and Whisper hears it too)."""
import json
p = 'data/lyrics.json'; L = json.load(open(p))
L['timingChecks'] = __doc__.replace('\n', ' '); json.dump(L, open(p, 'w'), indent=0)
