// The red cloth comes down over the cradle like a canopy, and the cradle under it fills with light.
export const kind = 'three';
import { shot, THREE, br, g, rise, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { sheet, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { rig } from '/kit/motion.js';
export default shot('s39-bless-her', {
  sky: { hour: 'afternoon', az: 70, extent: 8, center: [0, 1, 2.6], gust: 0.5, el: 22 },
  build(S, P) {
    const R = camp(S, { at: [0, 2], n: 36000, r: 10, tents: 2, jars: true, flowers: 360 }), sc = S.scene, y = G(0, 2.6); const C = K.cradle(sc, at(0, 2.6), { rot: 0.2, s: 1.35, hoop: true }); K.rug(sc, [0, undefined, 2.6], { w: 2.4, d: 1.5, seed: 4, rot: 0.1 }); const posts = [[-1.05, 2.0], [1.05, 2.0], [-1.05, 3.1], [1.05, 3.1]]; posts.forEach(([x, z]) => K.mesh(K.sweep([K.V(x, y - 0.15, z), K.V(x + 0.02, y + 0.7, z), K.V(x, y + 1.42, z)], 0.026, { S: 10 }), K.mat('paleWood'), sc));
    const dn = (t) => ease.inOut3((t - 188.2) / 1.9); const W = 2.7, H = 1.9; const m = woolMat(COL.red, { border: { uBorder: 0.15, uBTeeth: 18 }, transl: 0.9 }); const cs = [[0, 0, -1.05, 2.0], [43, 0, 1.05, 2.0], [0, 33, -1.05, 3.1], [43, 33, 1.05, 3.1]];
    const Cc = sheet({ w: W, h: H, nx: 44, ny: 34, t0: P.from - 1.4, seed: 4, iter: 14, damp: 0.995, rest: (u, v) => [(u - 0.5) * W * 0.98, y + 2.75, 2.55 + (v - 0.5) * H * 0.95], pin: (i, j) => { const q = cs.find((k) => Math.abs(k[0] - (i < 22 ? i < 8 ? 0 : 99 : i > 35 ? 43 : 99)) < 1 && ((j === 5 && k[1] === 0) || (j === 28 && k[1] === 33)) && (i === 7 || i === 36)); return q ? (t) => [q[2], y + 2.75 - 1.31 * dn(t), q[3]] : null; }, wind: (t) => [0.4 * br(t), 1.6 * g(t, 188.6, 0.5, 0.6, 0.6), 0.5 * br(t + 3)], ground: G }), cm = clothMesh(sc, Cc, m);
    const l = new THREE.PointLight(new THREE.Color(1, 0.78, 0.44), 0, 0, 2); l.position.set(0, y + 0.62, 2.6); sc.add(l); K.jar(sc, at(-1.7, 2.0), { s: 0.9, seed: 3 });
    return { update(t) { cm.set(t); const k = rise(t, 190.3, 1.3); l.intensity = 5.5 * k; C.rock(0.10 * Math.sin((t - 190.4) * 3.4) * rise(t, 190.4, 1.0)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[2.0, 1.05, 6.0], [1.1, 0.95, 5.7], [0.1, 0.90, 5.3]], look: [[0, 1.15, 2.6], [0, 1.0, 2.6], [0, 0.85, 2.6]], fov: [42, 38], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.004, focus: 2.9 }),
});
