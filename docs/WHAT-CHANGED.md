# What this film did differently from Genesis 16

Shane on version 1: "Whatever changes were implemented this video nailed it." These are the changes, so they can be kept.
Both films followed the same procedure (`docs/PROCEDURE.md`). Genesis 16's numbers are from its own records.

| | Genesis 16, version 3 | Genesis 17, version 1 |
|---|---|---|
| Renderer | raymarched world in one shader | Three.js scenes (`kind = 'three'`) of real geometry |
| Scenes | 47 for 273 s | 71 for 350 s, every cut on a beat or in a breath |
| Cost on OmiPC | 0.76 to 1.45 s a frame | 0.35 s a frame, 2.07 h for all 21,000 frames |
| Samples | 8, 16 on fast motion | 16 on every scene |

**What makes the picture**

1. **Light is sampled, not faked.** The engine averages 16 sub-frames for motion blur. Each sub-frame also draws one
   point of the sun's disc and one direction of the open sky. Soft shadows and contact shade come free and are true.
2. **Grown trees, not modelled ones.** The oak is space colonisation from hand-placed limbs: about 29,000 sprigs of
   leaves that sway with the wind.
3. **The light of the Presence is marched through its own shadow map.** Leaves, cloth and staff cut it into rays.
4. **Surfaces are written per material** (clay, goat hair, wool, wet clay, limestone, bark, bronze, gold, water), with
   procedural bumps, and a bump falloff that keeps edges clean.
5. **Ground that is a place:** terraced hills, 50,000 blades of grass that bow to one gust, flowers, stones
   in families, trodden paths, a camp.
6. **A graduated filter at the foot of the frame**, so lyrics always have darker ground and never need a heavy halo.
7. **One day, in order:** stars, dawn, sunrise, morning, noon, afternoon, golden hour, dusk, stars.

**What makes the story**

8. **One sentence per shot:** which object does what on which sung word.
9. **More actors, each with one meaning:** staff (Abram, then Abraam), red cloth (Sara, then Sarrha with a gold hem),
   short staff with indigo banner (Ismael), hooped cradle with bells (Isaac), cord of flax and light (the covenant),
   seal and clay rounds (the new name, the sign), lamps and staffs (the household).
10. **The covenant is one cord with two strands.** When the flax breaks, the light stays.
11. **The sign is never shown:** a seal pressed in clay, a curtain that closes, a lamp that is lit.
12. **Real physics where it shows:** simulated cloth with pins, bells with tongues, grain that pours, coins that roll
    and settle, a circlet that wobbles down, a staff that falls with a knock, footprints pressed one by one.
13. **Beats land on words:** the standards on "nations", the seal on "Abraam", the eighth lamp on "eight", the bells on
    "laughed", the light leaving on "went up".

**How it was checked**

14. **Three-critic panel twice:** on stills and motion clips before the render (look 6.3, motion 6.5, story 6.2, then
    one fix round of most scenes), and on the finished film (look 6.2, motion 6.3, story 6.5). Genesis 16 had one
    critic a round. Version 2 has not been scored by a panel.
15. **Measured checks on the encode:** 21,000 frames, full decode, audio offset 0 ms at three points, flash test, frozen
    runs, black runs.
16. **Clips before the render:** every scene at quarter size, looked at across time, so dead shots were found early.
17. **Photos copies:** a 799 MB phone copy with the 4.79 GB master, because iCloud took 19 minutes for the master alone.
