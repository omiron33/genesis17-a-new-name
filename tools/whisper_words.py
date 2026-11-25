import json, sys, whisper
import os
m = whisper.load_model(os.environ.get('WHISPER_MODEL', 'medium.en'))
r = m.transcribe('media/song.wav', language='en', word_timestamps=True, condition_on_previous_text=False, no_speech_threshold=0.9)
out = [{'w': w['word'].strip(), 'start': round(w['start'], 3), 'end': round(w['end'], 3)} for s in r['segments'] for w in s.get('words', [])]
json.dump({'segments': [{'start': s['start'], 'end': s['end'], 'text': s['text']} for s in r['segments']], 'words': out}, open('intake/whisper.json', 'w'), indent=0)
print('whisper words', len(out))
