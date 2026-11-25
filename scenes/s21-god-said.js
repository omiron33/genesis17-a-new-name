// Noon: the tent curtain lifts of itself, and light walks in over the rugs to the staff.
export const kind = 'three';
import { shot, THREE, rise, ease, br, g } from '/song/lib/shot.js';
import { inside, at, G, K } from '/song/lib/sets.js';
import { hang, clothMesh } from '/song/lib/cloth.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s21-god-said', {
  sky: { hour: 'noon', az: 10, extent: 9, center: [0, 1, 1], gust: 0.4, el: 34, envK: 0.55, skyK: 0.9 }, exposure: 1.0,
  build(S, P) {
    const I = inside(S, { fill: 0.5 }), sc = S.scene; const st = K.staff(sc, { p: at(0.15, -0.9) }); K.lean(st, 0.05, 2);
    const hm = K.mat('hair', { side: THREE.DoubleSide, u: { uStrips: 7 } }, 'door'); const lift = (t) => ease.inOut3((t - 99.2) / 1.5);
    const half = (sg) => hang({ a: [0.02 * sg, 1.74, 2.5 + 0.02 * sg], b: [2.6 * sg, 1.74, 2.5], h: 1.9, nx: 30, ny: 30, t0: P.from - 1.5, gather: 1.3, seed: 4 + sg, folds: 9, aero: 1.5, wind: (t) => [0.15 * sg, 0, -0.25 - 1.8 * g(t, 99.0, 0.5, 0.3, 1.0)], ground: G, top: (u, t) => [sg * (0.02 + 2.58 * (1 - (1 - u) * (1 - 0.72 * lift(t)))), 1.74, 2.5] }); const D = [half(-1), half(1)].map((c) => clothMesh(sc, c, K.mat('wool', { side: THREE.DoubleSide, transl: 0.7, u: { uCol: [0.42, 0.31, 0.20], uThreads: 200 } }, 'doorw'))), cm = { set(t) { D.forEach((d) => d.set(t)); } };
    K.mesh(K.sweep([K.V(-2.75, 1.80, 2.5), K.V(0, 1.83, 2.5), K.V(2.75, 1.80, 2.5)], 0.028, { S: 10 }), K.mat('wood'), sc); const Gy = glory(sc, { from: [0.4, 2.7, 13], to: [0.05, 0.35, -0.9], angle: 0.06, I: 2600, air: 4.0 });
    return { update(t) { cm.set(t); Gy.set(t, 0.25 + 0.9 * lift(t)); I.fill.intensity = 3 + 2.5 * lift(t); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.5, 0.95, -1.9], [-0.9, 0.9, -2.0], [-0.3, 0.95, -2.05]], look: [[0.2, 0.9, 1.5], [0.15, 0.95, 1.5], [0.1, 1.0, 1.5]], fov: [58, 54], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
