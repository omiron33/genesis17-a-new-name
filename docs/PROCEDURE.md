# How this film was made

This film followed the default song film procedure: the Genesis 16 process ("Agar in the Wilderness", version 3),
written in the Ark engine at `docs/SONG_FILM_PROCEDURE.md`.

What was the same: the song and lyrics from the approved take, forced alignment by two models on the separated
vocal, a storyboard before any animation in which every shot is an object doing something on a sung word, kit
motion (arcs, anticipation, weight, follow-through, simulated cloth), key stills with words, quarter-size motion
clips of every scene, the three-critic panel and one fix round, picture renders on one render machine through its
queue, overlays and the join on the other machine, then one panel on the finished film and one fix pass.

What differed, and why:

- **The renderer.** The procedure gives every film its own world. This one is meshes, grown trees and simulated
  cloth lit by sampled sun and sky, not a raymarched world. It costs 0.4 to 0.5 s a frame at 16 samples.
- **Sampling.** 16 sub-frames on every scene, because soft shadow and shade come from the sub-frames.
- **A graduated filter** over the foot of the frame, so light type always has darker ground behind it.

The four theme mockups were skipped, as for Genesis 16.
