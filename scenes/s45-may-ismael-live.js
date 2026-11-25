// The short staff with the indigo cloth, by itself in the grass; the tall staff leans over it; on "live" the indigo lifts.
export const kind = 'three';
import { shot, THREE, br, g, rise } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { ismael } from '/song/lib/cast.js';
import { glory } from '/song/lib/fire.js';
import { rig, spring, anticipate } from '/kit/motion.js';
export default shot('s45-may-ismael-live', {
  sky: { hour: 'afternoon', az: 95, extent: 8, center: [0, 1, 4], gust: 0.6, el: 20 },
  build(S, P) {
    const R = camp(S, { at: [0, 5], n: 60000, r: 11, tents: 2, flowers: 520, tall: 1.15 }), sc = S.scene; const X = 0.75, Z = 4.4, tall = K.staff(sc, { p: at(-0.75, 4.1) }); const y = G(X, Z), lift = (t) => g(t, 217.75, 0.5, 1.2, 1.2); const I = ismael(S, P, { x: X, z: Z, h: 1.2, wind: (t) => [1.9 * br(t) + 3.4 * lift(t), 2.4 * lift(t), 0.5 * br(t + 3) + 0.6 * lift(t)] });
    const Gy = glory(sc, { from: [1.5, 13, -2.5], to: [X, y + 0.6, Z], angle: 0.10, I: 2400, air: 1.5 });
    return { update(t) { I.set(t); const a = 0.03 + 0.30 * anticipate(t, 215.0, { lead: 0.5, back: 0.15, dur: 1.4 }) + 0.02 * Math.sin(t * 1.4); K.lean(tall, a, Math.PI / 2 - 0.15); Gy.set(t, 0.12 + 1.0 * rise(t, 217.6, 1.0)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.2, 0.9, 7.2], [-0.2, 0.85, 7.1], [0.8, 0.9, 6.8]], look: [[0.0, 0.80, 4.2], [0.3, 0.78, 4.2], [0.6, 0.80, 4.2]], fov: [38, 35], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.004, focus: 2.7 }),
});
