// Close on the indigo streaming against the sun, the young staff leaning into the wind and springing back.
export const kind = 'three';
import { shot, THREE, br, g, ring } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { ismael } from '/song/lib/cast.js';
import { rig } from '/kit/motion.js';
export default shot('s46-ismael-wind', {
  sky: { hour: 'golden', az: 190, extent: 8, center: [0, 1, 4], gust: 1.1, el: 9 },
  build(S, P) {
    const R = camp(S, { at: [0, 4], n: 52000, r: 10, tents: 1, flowers: 420, tall: 1.3, spots: [], oak: { at: [-9, 0, -14] } }); const gw = (t) => 4.6 + 2.2 * g(t, 220.2, 0.6, 0.5, 1.2) + 2.6 * g(t, 221.9, 0.5, 0.7, 1.4), tilt = (t) => 0.02 + 0.035 * (gw(t) - 4.0) + 0.03 * ring(t, 221.6, 1.2, 1.2);
    const I = ismael(S, P, { x: -0.55, z: 4.4, h: 1.52, at: 0.83, w: 1.15, ch: 0.62, tilt, wind: (t) => [gw(t) * 1.15, 1.4 + 0.42 * gw(t), 0.8 * br(t + 3) - 0.3] });
    return { update(t) { I.set(t); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.2, 0.80, 6.7], [0.1, 0.84, 6.4], [0.5, 0.95, 6.2]], look: [[0.1, 1.02, 4.4], [0.12, 1.02, 4.4], [0.15, 1.02, 4.4]], fov: [40, 36], enter: 'moving', exit: 'moving', handheld: 0.12, aperture: 0.005, focus: 2.1 }),
});
