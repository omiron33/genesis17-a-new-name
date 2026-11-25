# Contributing to A New Name (Genesis 17)

Pull requests are welcome: bug fixes, documentation, new scene ideas and tooling.

Every pull request needs an approving review from Shane Fisher (@omiron33), the code owner, before it can be merged. Please work on a branch or a fork and open a pull request against `main`.

## Guidelines

- Every frame must be a pure function of song time: no wall-clock time or unseeded randomness.
- Lyrics are their own sharp type layer, set on a plane placed in the scene.
- Scene timings come from `docs/plan.json` through `tools/plan.py`; do not hand-edit `film.json` or `docs/STORYBOARD.md`.
- No people drawn in code: show them through what they leave (footprints, cloth, light).
- The original recording (`media/song.wav`) is not in this repository and must never be committed.
