"""Build data/lyrics.json for a song folder (cwd): CTC forced alignment of intake/sung-lyrics.txt on
the separated vocal stem (intake/words-ctc.json), with the voice entry and per-line checks taken from
local Whisper (intake/whisper.json). Beats come from data/audio.json. Machine estimates."""
import json, re
C = json.load(open('intake/words-ctc.json'))['words']
A = json.load(open('data/audio.json'))
W = json.load(open('intake/whisper.json'))['words']
lines = [l.strip() for l in open('intake/sung-lyrics.txt') if l.strip()]
toks = [(i, t) for i, l in enumerate(lines) for t in l.split()]
assert len(toks) == len(C), (len(toks), len(C))
words = [{'w': t, 'start': c['start'], 'end': c['end'], 'line': i} for (i, t), c in zip(toks, C)]
norm = lambda s: re.sub(r"[^a-z]", '', s.lower())
# CTC tends to let the first word absorb an instrumental intro: take the voice entry from Whisper's
# first matching word when CTC starts much earlier
first = next((w for w in W if norm(w['w']) == norm(words[0]['w'])), None)
if first and first['start'] - words[0]['start'] > 0.5 and first['start'] < words[0]['end']:
    words[0]['start'] = round(first['start'], 3)
words[-1]['end'] = min(words[-1]['end'], words[-1]['start'] + 4.0)
for a, b in zip(words, words[1:]):
    a['end'] = min(a['end'], b['start'])
    if a['end'] - a['start'] < 0.06: a['end'] = min(b['start'], a['start'] + 0.06)
out_lines = []
for i, l in enumerate(lines):
    ws = [w for w in words if w['line'] == i]
    out_lines.append({'text': l, 'start': round(ws[0]['start'], 3), 'end': round(ws[-1]['end'], 3)})
# agreement check: share of CTC words that Whisper heard within 0.6 s with the same spelling
wi = [(norm(w['w']), w['start']) for w in W]
hit = sum(1 for w in words if any(n == norm(w['w']) and abs(s - w['start']) < 0.6 for n, s in wi))
beats = [b['time'] for b in A['beats']]
json.dump({'source': 'force-aligned to the separated vocal (local torchaudio CTC), checked against local Whisper; machine estimates',
           'whisperAgreement': round(hit / len(words), 3),
           'duration': A['duration'], 'bpm': A['bpm'], 'beats': beats,
           'lines': out_lines, 'words': [{'w': w['w'], 'start': round(w['start'], 3), 'end': round(w['end'], 3)} for w in words]},
          open('data/lyrics.json', 'w'), indent=0)
print('whisperAgreement', round(hit / len(words), 3), 'words', len(words), 'lines', len(out_lines))
