// On "Yes" the light opens over the red cloth and the staff together; every leaf answers.
export const kind = 'three';
import { shot, THREE, br, g, rise } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { hang, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s47-yes', {
  sky: { hour: 'golden', az: 118, extent: 11, center: [0, 1.5, 1], gust: 0.4, el: 12 },
  build(S, P) {
    const R = camp(S, { at: [0, 2], n: 52000, r: 11, tents: 2, jars: true, hearth: true, altar: true, flowers: 420 }), sc = S.scene, y = G(0.6, 0.6); K.line(sc, [-0.1, y + 2.05, 0.9], [2.9, y + 2.05, 0.4], { sag: 0.04 }); const m = woolMat(COL.red, { border: { uBorder: 0.16, uBTeeth: 16 }, transl: 0.7 }); const gust = (t) => g(t, 227.0, 0.25, 0.7, 1.4); const C = hang({ a: [0.2, y + 2.02, 0.85], b: [2.4, y + 2.02, 0.49], h: 1.5, nx: 38, ny: 34, t0: P.from - 2.5, seed: 4, sag: 0.04, ground: G, wind: (t) => [0.7 * br(t) * (1 - 0.9 * rise(t, 225.9, 0.6) + 0.9 * rise(t, 227.0, 0.3)) + 4.4 * gust(t), 1.2 * gust(t), 0.8 * br(t + 2) + 2.2 * gust(t)] }), cm = clothMesh(sc, C, m);
    const st = K.staff(sc, { p: at(-1.2, 1.0) }); const Gy = glory(sc, { from: [2.5, 17, 5.5], to: [0.2, 0, 0.8], angle: 0.24, I: 4200, air: 1.5 });
    return { update(t) { R.hearth.set(t); cm.set(t); const k = rise(t, 226.85, 0.5); U.uGust.value = 0.45 - 0.35 * rise(t, 225.9, 0.6) + 0.35 * rise(t, 227, 0.2) + 2.2 * gust(t); K.lean(st, 0.03 + 0.09 * gust(t), Math.PI / 2); Gy.set(t, 0.12 + 1.15 * k + 0.15 * g(t, 227.0, 0.2, 0.1, 0.8)); m.userData.u.uBorderGlow.value = 0.5 * k; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.6, 0.95, 4.9], [-0.9, 1.0, 5.2], [0.2, 1.25, 6.0]], look: [[0.4, 1.35, 0.5], [0.4, 1.6, 0.2], [0.4, 2.1, -0.4]], fov: [44, 48], enter: 'moving', exit: 'moving', handheld: 0.12 }),
});
