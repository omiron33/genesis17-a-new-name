# A New Name (Genesis 17)

Built with the Ark engine: https://github.com/omiron33/ark-video-studio

A code-rendered lyric film of Genesis 17. Abram is ninety-nine when the Lord appears to him. He is given
a new name, Abraam, and an everlasting covenant with its sign; Sara becomes Sarrha, and a son is promised,
Isaac. Abraam laughs, pleads for Ismael, and is heard. That same day he does as God had told him.

[Listen at TechnoChristianity](https://technochristianity.com/music/) · [More films on YouTube](https://www.youtube.com/@technochristianity)

## How it is made

71 short scenes cut on measured beats, one hill for the whole film (Mambre, with its great oak), one day
from stars to stars, and the lyrics as their own sharp type layer. No person is drawn. The staff is
Abraam, the red cloth Sarrha, the short staff with the indigo cloth Ismael, and the empty cradle Isaac. The
covenant is a cord of flax and light. God is light only. The sign is shown as a seal pressed in clay.

- `lib/core.js`: the material factory and the light. Each frame averages its sub-frames, and every
  sub-frame samples a point on the sun's disc and one direction of the open sky, so shadows and shade
  are soft and true.
- `lib/sky.js`: the hours of the day, cloud, stars, air. `lib/land.js`: the hill, grass, flowers, stones.
  `lib/tree.js`: trees grown by space colonisation. `lib/cloth.js`: simulated cloth. `lib/props.js`: the
  things that act. `lib/fire.js`: flames, smoke, dust, and the shaft of light marched through its own
  shadow map. `lib/prints.js`: footprints. `lib/sets.js`: the camp, the stone bench, the inside of the tent.
- `scenes/sNN-*.js`: one picture each. `scenes/sNN-*.lyric.js`: its words, written by `tools/lyrics.py`.
- `tools/author.py` is the storyboard; `tools/plan.py` cuts it to the beat and writes `film.json`.
- `data/`: the sung words, force-aligned to the separated vocal by two models (they agree within 0.15 s on
  544 of 550 words; nobody has checked them by ear), and the measured beats (82 BPM).

## Rendering

Put the original 48 kHz stereo recording at `media/song.wav`. It is not in this repository. The scenes are
Three.js scenes for the engine's premium page: 1920 × 1080 at 60 fps, 16 sub-frames, CRF 12.

## License

The source code is released under the [MIT License](LICENSE). The song recording and the finished film are
separate media releases. The source-code license grants no rights to the recording, to its lyrics as a
recorded work, or to the rendered film.
