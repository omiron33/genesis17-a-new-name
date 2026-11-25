// On "Sarrha" the red cloth opens wide in the light, and gold runs along its hem.
export const kind = 'three';
import { shot, THREE, br, g, rise, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { sheet, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s38-sarrha', {
  sky: { hour: 'afternoon', az: 168, extent: 9, center: [0, 2, 2.6], gust: 0.8, el: 22 },
  build(S, P) {
    const R = camp(S, { at: [0, 3], n: 40000, r: 10, tents: 1, flowers: 420, oak: { at: [-4, 0, -9] } }), sc = S.scene, y = G(0, 2.6); const W = 2.6, H = 1.9; K.line(sc, [-1.75, y + 2.34, 2.62], [1.75, y + 2.34, 2.58], { sag: 0.05 }); const open = (t) => 0.74 + 0.26 * ease.out3((t - 186.7) / 0.8);
    const m = woolMat(COL.red, { border: { uBorder: 0.17, uBorderGlow: 0, uBorderOn: 0, uBTeeth: 18 }, transl: 0.8 });
    const C = sheet({ w: W, h: H, nx: 44, ny: 34, t0: P.from - 1.6, seed: 4, iter: 14, rest: (u, v) => [(u - 0.5) * W * 0.74, y + 2.3 - 0.2 * Math.sin(u * 3.14) - v * H, 2.6 + 0.1 * Math.sin(u * 14)], pin: (i, j, nx) => { if (j !== 0 || (i % 7 !== 0 && i !== nx - 1)) return null; const u = i / (nx - 1); return (t) => [(u - 0.5) * W * 0.99 * open(t), y + 2.28 + 0.10 * Math.pow(Math.abs(u - 0.5) * 2, 2) + 0.03 * Math.sin(t * 2 + u * 5), 2.6 + 0.06 * Math.sin(u * 12 + 1)]; }, wind: (t) => [0.5 * br(t), 0.3, 1.2 * br(t + 2) - 2.2 * g(t, 186.3, 0.3, 0.1, 0.2) + 5.4 * g(t, 187.0, 0.35, 0.9, 1.2)], ground: G }), cm = clothMesh(sc, C, m);
    const Gy = glory(sc, { from: [-1.0, 13, -3.0], to: [0, y + 1.6, 2.6], angle: 0.15, I: 950, air: 2.2 }); K.jar(sc, at(-2.0, 2.2), { s: 1.0, seed: 3 }); K.jar(sc, at(2.2, 2.0), { s: 0.8, seed: 5 });
    return { update(t) { cm.set(t); const k = rise(t, 187.15, 0.55); m.userData.u.uBorderOn.value = k; m.userData.u.uBorderGlow.value = 0.9 * g(t, 187.3, 0.3, 0.2, 1.2) * k; Gy.set(t, 0.5 + 0.8 * rise(t, 186.8, 0.6)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.6, 1.0, 6.6], [0.9, 0.95, 6.4], [0.0, 1.0, 6.2]], look: [[0, 1.55, 2.6], [0, 1.6, 2.6], [0, 1.62, 2.7]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
