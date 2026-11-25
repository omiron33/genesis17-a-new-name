// The staff's long shadow swings over the ground as the sun goes down, across a ring of stones, to the last.
export const kind = 'three';
import { shot, THREE, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { sunv } from '/song/lib/sky.js';
import { instances } from '/song/lib/land.js';
import { rig } from '/kit/motion.js';
export default shot('s61-that-very-day', {
  sky: { hour: 'sunset', az: 140, extent: 8, center: [0, 0.6, 3.2], gust: 0.4, el: 10, skyK: 1.0, sunK: 1.25 },
  build(S) {
    const R = camp(S, { at: [0, 1], n: 26000, r: 10, tents: 2, hearth: { I: 14 }, jars: true, oak: false, spots: [[0, 3.2, 3.2]] }), sc = S.scene, c = at(0, 2.6), st = K.staff(sc, { p: c, h: 1.1, hook: true }); const N = 9, sets = [...Array(N)].map((_, i) => { const a = -0.55 + 2.35 * i / (N - 1), r = 1.75, x = Math.sin(a) * r, z = 2.6 + Math.cos(a) * r; return { p: [x, G(x, z) + 0.05, z], s: [0.11, 0.085, 0.10], r: [0.2, i * 1.3, 0.1] }; }); instances(sc, K.pebbleGeo(0), K.mat('paleStone', { uvless: true }), sets);
    return { update(t) { const k = Math.min(1, Math.max(0, (t - 291.1) / 3.35)); const az = 152 + 128 * (k * 0.75 + 0.25 * ease.inOut3(k)), el = 20 - 14 * k; S.sky.setSun(sunv(az, el)); S.sky.light.sun.color.setRGB(1, 0.74 - 0.24 * k, 0.46 - 0.22 * k); R.hearth.set(t); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.9, 1.35, 5.9], [1.1, 1.45, 6.0], [0.2, 1.6, 5.9]], look: [[0.3, 0.25, 3.1], [0.2, 0.22, 3.1], [0.1, 0.2, 3.1]], fov: [42, 42], enter: 'moving', exit: 'moving', handheld: 0.08 }),
});
