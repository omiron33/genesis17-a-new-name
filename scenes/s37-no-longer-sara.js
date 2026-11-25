// Light comes to the red cloth; the wind drops; its plain hem hangs still, and on "no longer" it slips from its line.
export const kind = 'three';
import { shot, THREE, br, g, rise } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { hang, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { glory } from '/song/lib/fire.js';
import { rig, follow } from '/kit/motion.js';
export default shot('s37-no-longer-sara', {
  sky: { hour: 'afternoon', az: 152, extent: 9, center: [0.5, 1.4, 2.6], gust: 0.7, el: 24 },
  build(S, P) {
    const R = camp(S, { at: [0, 3], n: 46000, r: 10, tents: 2, jars: true, hearth: true, flowers: 420 }), sc = S.scene, y = G(0.5, 2.6); const a = [-0.9, y + 2.12, 2.75], b = [1.9, y + 2.12, 2.45]; K.line(sc, [-1.25, y + 2.14, 2.79], [2.25, y + 2.14, 2.41], { sag: 0.04 }); const st = K.staff(sc, { p: at(-2.0, 2.0) }); K.lean(st, 0.06, 2); K.jar(sc, at(2.9, 2.9), { s: 1.0, seed: 3 }); K.jar(sc, at(3.3, 2.5), { s: 0.7, seed: 6 });
    const off = (t) => { const k = Math.max(0, t - 182.2); return k * k * (3 - Math.min(2, k)) / 3; }; const C = hang({ a, b, h: 1.55, nx: 40, ny: 36, t0: P.from - 2.5, seed: 4, gather: 1.25, sag: 0.04, ground: G, top: (u, t) => { const k = off(t + 0.10 * Math.sin(u * 7)), m = Math.min(1, k); return [a[0] + (b[0] - a[0]) * u * (1 - 0.12 * m) + 0.62 * k, a[1] + 0.50 * k + 0.16 * m * Math.sin(u * 6 - t * 3.2) - 0.30 * m * Math.pow(Math.abs(u - 0.5) * 2, 2), a[2] + (b[2] - a[2]) * u + 0.30 * k + 0.14 * m * Math.sin(u * 5 + t * 2.6)]; }, wind: (t) => [0.9 * br(t) * (1 - 0.9 * rise(t, 178.6, 1.5)) + 3.4 * rise(t, 182.25, 0.6), 2.6 * rise(t, 182.2, 0.4), (1.4 * br(t + 3) + 1.6 * g(t, 176.9, 0.4, 0.4, 1.0)) * (1 - 0.9 * rise(t, 178.6, 1.5)) + 4.2 * rise(t, 182.2, 0.6)] }), cm = clothMesh(sc, C, woolMat(COL.red, {}));
    const Gy = glory(sc, { from: [-1.5, 14, -3.5], to: [0.5, y + 1.0, 2.6], angle: 0.13, I: 3600, air: 1.5 });
    return { update(t) { R.hearth.set(t); cm.set(t); const k = rise(t, 177.4, 2.2); Gy.set(t, 0.15 + 1.0 * k, [-1.5 - 3 * (1 - k), 14, -3.5], [0.5 - 2.4 * (1 - k), y + 1.0, 2.6]); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-2.4, 1.25, 7.0], [-1.0, 1.15, 6.8], [0.6, 1.15, 6.3], [1.4, 1.2, 5.9]], look: [[-0.4, 1.3, 2.6], [0.3, 1.3, 2.6], [0.9, 1.6, 2.7], [1.5, 2.2, 3.0]], fov: [40, 40], enter: 'moving', exit: 'moving', handheld: 0.12 }),
});
