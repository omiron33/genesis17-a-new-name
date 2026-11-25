// The light turns and comes to the indigo cloth, hanging low; on "heard" it lifts its head.
export const kind = 'three';
import { shot, THREE, br, g, rise } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { ismael } from '/song/lib/cast.js';
import { glory } from '/song/lib/fire.js';
import { rig, anticipate } from '/kit/motion.js';
export default shot('s51-i-have-heard', {
  sky: { hour: 'golden', az: 138, extent: 9, center: [0, 1, 3], gust: 0.4, el: 10 },
  build(S, P) {
    const R = camp(S, { at: [0, 3], n: 52000, r: 11, tents: 2, jars: true, hearth: true, flowers: 420 }), sc = S.scene; const tall = K.staff(sc, { p: at(-1.9, 2.4) }); K.lean(tall, 0.05, 1.6); const X = 0.9, Z = 3.0, y = G(X, Z), tl = (t) => 0.40 - 0.42 * anticipate(t, 247.55, { lead: 0.4, back: 0.10, dur: 0.9 }), lift = (t) => g(t, 247.6, 0.5, 0.7, 1.4), I = ismael(S, P, { x: X, z: Z, h: 1.25, tilt: tl, wind: (t) => [0.9 * br(t) + 5.4 * lift(t), 3.0 * lift(t), 0.4 * br(t + 3)] });
    const Gy = glory(sc, { from: [0, 15, -4], to: [0, 0, 3], angle: 0.105, I: 4200, air: 1.7 });
    return { update(t) { R.hearth.set(t); I.set(t); const x = -1.8 + 2.7 * rise(t, 244.6, 2.4); Gy.set(t, 0.85 + 0.35 * rise(t, 247.4, 0.6), [x - 0.6, 15, -4], [x, y, 3.0]); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.9, 1.15, 7.0], [-0.5, 1.0, 6.9], [1.0, 1.0, 6.5]], look: [[-0.6, 0.85, 2.8], [0.2, 0.80, 2.9], [0.95, 0.80, 3.0]], fov: [42, 36], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.003, focus: 3.9 }),
});
