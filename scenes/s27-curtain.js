// The tent curtain falls closed before the lamplight: what is done within is not shown.
export const kind = 'three';
import { shot, THREE, ease, g, br } from '/song/lib/shot.js';
import { camp, at, G, K, flick } from '/song/lib/sets.js';
import { hang, clothMesh, woolMat } from '/song/lib/cloth.js';
import { rig } from '/kit/motion.js';
export default shot('s27-curtain', {
  sky: { hour: 'noon', az: 215, extent: 9, center: [-9, 1.2, -2], gust: 0.5, el: 30 },
  build(S, P) {
    const R = camp(S, { at: [-8, 1], n: 34000, r: 10, tents: 1, hearth: true, jars: true, spots: [[-8, 0, 3]] }), sc = S.scene; const st = K.staff(sc, { p: at(-5.3, 0.3) }); K.lean(st, 0.16, 2.6); const st2 = K.staff(sc, { p: at(-5.15, 0.55), h: 1.0, seed: 11, wood: 'paleWood' }); K.lean(st2, 0.2, 2.4);
    const rt = 0.42, c = Math.cos(rt), s = Math.sin(rt), o = at(-9.2, -3.6), W = (x, y, z) => [o[0] + x * c + z * s, o[1] + y, o[2] - x * s + z * c]; K.mesh(K.sweep([K.V(...W(-3.45, 1.45, 2.62)), K.V(...W(3.45, 1.45, 2.62))], 0.026, { S: 9 }), K.mat('wood'), sc); for (const x of [-3.4, 3.4]) K.mesh(K.sweep([K.V(...W(x, -0.2, 2.62)), K.V(...W(x, 1.52, 2.62))], 0.032, { S: 9 }), K.mat('wood'), sc); const lp = W(-0.4, 0.9, -0.6), L = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 16, 0, 2); L.position.set(...lp); sc.add(L); const a = W(-3.3, 1.42, 2.62), b = W(3.3, 1.42, 2.62);
    const open = (t) => 1 - ease.inOut3((t - 123.2) / 2.0); const C = hang({ a, b, h: 1.50, nx: 72, ny: 28, t0: P.from - 2.2, seed: 6, gather: 1.34, folds: 25, fold: 0.09, sag: 0.0, aero: 1.5, ground: G, wind: (t) => [0.5 * br(t), 0, 0.9 * br(t + 2) + 1.4 * g(t, 124.4, 0.2, 0.1, 0.6)], top: (u, t) => { const k = open(t), q = u * (1 - 0.72 * k); return a.map((v, i) => v + (b[i] - v) * q); } }), cm = clothMesh(sc, C, woolMat([0.50, 0.40, 0.27], { threads: 260, transl: 0.9, border: { uBorder: 0.12, uBorderMetal: 0, uBorderCol: [0.35, 0.05, 0.04], uBTeeth: 40 } }));
    K.jar(sc, at(-6.9, 0.5), { s: 1.0, seed: 4 });
    return { update(t) { R.hearth.set(t); cm.set(t); L.intensity = 16 * flick(t, 2); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-4.6, 1.15, 5.2], [-5.4, 1.15, 4.6], [-6.4, 1.2, 4.0]], look: [[-8.0, 1.15, -1.6], [-8.1, 1.1, -1.8], [-8.2, 1.05, -2]], fov: [44, 42], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
