// Outside the great tent, staff after staff is leaned on the ropes; inside, lamplight; the curtain drops.
export const kind = 'three';
import { shot, THREE, ease, br, g, ring } from '/song/lib/shot.js';
import { camp, at, G, K, flick } from '/song/lib/sets.js';
import { hang, clothMesh, woolMat } from '/song/lib/cloth.js';
import { rig } from '/kit/motion.js';
export default shot('s60-every-man', {
  sky: { hour: 'sunset', az: 110, extent: 9, center: [-9, 1.2, -1], gust: 0.4, skyK: 1.1, el: 7 },
  build(S, P) {
    const R = camp(S, { at: [-8, 2], n: 34000, r: 10, tents: 1, hearth: { I: 12, shadow: false, smokeCol: [0.4, 0.34, 0.34] }, jars: false, spots: [[-8, 0, 3.4]] }), sc = S.scene; const rt = 0.42, c = Math.cos(rt), s = Math.sin(rt), o = at(-9.2, -3.6), W = (x, y, z) => [o[0] + x * c + z * s, o[1] + y, o[2] - x * s + z * c]; const L = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 34, 0, 2); L.position.set(...W(-0.4, 0.9, -0.4)); sc.add(L);
    K.mesh(K.sweep([K.V(...W(-3.45, 1.45, 2.62)), K.V(...W(3.45, 1.45, 2.62))], 0.026, { S: 9 }), K.mat('wood'), sc); for (const x of [-3.4, 3.4]) K.mesh(K.sweep([K.V(...W(x, -0.2, 2.62)), K.V(...W(x, 1.52, 2.62))], 0.032, { S: 9 }), K.mat('wood'), sc); const a = W(-3.3, 1.42, 2.62), b = W(3.3, 1.42, 2.62), open = (t) => 1 - ease.inOut3((t - 288.4) / 1.5); const C = hang({ a, b, h: 1.50, nx: 72, ny: 28, t0: P.from - 2.2, seed: 6, gather: 1.34, folds: 25, fold: 0.09, sag: 0.0, aero: 1.5, ground: G, wind: (t) => [0.4 * br(t), 0, 0.6 * br(t + 2) + 1.2 * g(t, 289.5, 0.2, 0.1, 0.6)], top: (u, t) => { const k = open(t), q = u * (1 - 0.72 * k); return a.map((v, i) => v + (b[i] - v) * q); } }), cm = clothMesh(sc, C, woolMat([0.50, 0.40, 0.27], { threads: 260, transl: 1.2, border: { uBorder: 0.12, uBorderMetal: 0, uBorderCol: [0.35, 0.05, 0.04], uBTeeth: 40 } }));
    // a rail before the tent: the staffs come to it one by one
    const r0 = W(0.9, 0, 3.9), r1 = W(4.8, 0, 3.5); K.line(sc, [r0[0], r0[1] + 0.95, r0[2]], [r1[0], r1[1] + 0.95, r1[2]], { r: 0.022, sag: 0.0 }); const N = 8, st = [...Array(N)].map((_, i) => { const u = (i + 0.6) / N, x = r0[0] + (r1[0] - r0[0]) * u, z = r0[2] + (r1[2] - r0[2]) * u; const fx = x + s * 0.42, fz = z + c * 0.42; const m = K.staff(sc, { p: at(fx, fz), h: 1.25 + 0.5 * ((i * 0.618) % 1) - (i === 5 ? 0.35 : 0), seed: 2 + i * 3, hook: i % 3 !== 1, wood: i % 2 ? 'paleWood' : 'wood', wrap: i % 2 === 0 }); return { m, t0: 286.3 + 0.36 * i, fx, fz }; });
    return { update(t) { R.hearth.set(t); cm.set(t); L.intensity = 34 * flick(t, 2); st.forEach((q, i) => { const d = t - q.t0, k = ease.inOut3(d / 0.30); q.m.visible = d > -0.35; const out = Math.max(0, -d / 0.35); q.m.position.set(q.fx + s * 0.7 * out, G(q.fx, q.fz) + 0.25 * Math.sin(Math.min(1, out) * Math.PI) + 0.1 * out, q.fz + c * 0.7 * out); K.lean(q.m, 0.02 + 0.40 * k - 0.05 * Math.abs(ring(t, q.t0 + 0.30, 4.5, 6)), rt + Math.PI + 0.12 * Math.sin(i * 2.1)); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-3.6, 1.15, 4.8], [-4.6, 1.15, 4.6], [-5.6, 1.2, 4.4]], look: [[-6.4, 1.0, -0.8], [-6.9, 1.0, -1.1], [-7.4, 1.0, -1.4]], fov: [46, 46], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
