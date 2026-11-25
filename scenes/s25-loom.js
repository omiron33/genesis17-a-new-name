// The loom: the shuttle flies, the batten falls, and band by band the cloth of the generations grows.
export const kind = 'three';
import { shot, THREE, ease, g } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { M } from '/song/lib/core.js';
import { rig } from '/kit/motion.js';
export default shot('s25-loom', {
  sky: { hour: 'noon', az: 35, extent: 8, center: [0, 1.2, 3], gust: 0.45, el: 42 },
  build(S) {
    const R = camp(S, { at: [0, 0], n: 22000, r: 9, tents: 2, far: 300, jars: true, hearth: true }), sc = S.scene, b = at(0, 2.8), W = 1.15, H = 1.75, N = 92;
    for (const s of [-1, 1]) K.mesh(K.sweep([K.V(s * 0.72, -0.2, 0), K.V(s * 0.70, 0.9, 0.02), K.V(s * 0.72, 2.0, 0)], 0.040, { S: 12 }), K.mat('wood'), sc, b); K.mesh(K.sweep([K.V(-0.88, 1.88, 0.03), K.V(0, 1.90, 0.03), K.V(0.88, 1.88, 0.03)], 0.045, { S: 14 }), K.mat('paleWood'), sc, b); K.mesh(K.sweep([K.V(-0.80, 0.30, 0.04), K.V(0, 0.30, 0.04), K.V(0.80, 0.30, 0.04)], 0.036, { S: 14 }), K.mat('paleWood'), sc, b);
    const th = new THREE.CylinderGeometry(0.0023, 0.0023, 1, 5); th.translate(0, 0.5, 0); const warp = instances(sc, th, K.mat('rope', {}, 'warp'), [...Array(N)].map((_, i) => ({ p: [b[0] - W / 2 + W * i / (N - 1), b[1] + 0.30, b[2] + 0.05 + (i % 2 ? 0.012 : 0)], s: [1, 1.58, 1] })));
    const cg = new THREE.PlaneGeometry(W, 1, 60, 60); cg.translate(0, 0.5, 0); const cm = M('rug', { side: THREE.DoubleSide, u: { uSeed: 4, uBands: 17, uTop: 0.5, uColA: [0.42, 0.04, 0.03], uColB: [0.05, 0.07, 0.24], uColC: [0.72, 0.60, 0.38] }, surf: 'if (p.y > uTop + .002 * sin(p.x * 60.)) discard;' }); const cl = K.mesh(cg, cm, sc, [b[0], b[1] + 0.335, b[2] + 0.057]); cl.scale.y = 1.45;
    const bat = K.mesh(new THREE.BoxGeometry(1.34, 0.075, 0.022, 20, 2, 2), K.mat('wood'), sc); const sh = new THREE.SphereGeometry(1, 30, 16); sh.scale(0.15, 0.022, 0.028); const shut = K.mesh(sh, K.mat('paleWood', { uvless: true }), sc); const weft = K.liveTube(sc, K.mat('rope', { u: { uTwist: 600, uCol: [0.65, 0.07, 0.05] } }), { n: 60, r: 0.0035 });
    K.jar(sc, at(1.5, 2.7), { s: 0.8, seed: 3 }); K.bag(sc, at(-1.5, 2.9), { s: 1.2 }); K.jar(sc, at(-1.25, 3.4), { kind: 'bowl', s: 1.1 });
    for (let i = 0; i < 5; i++) { const q = K.mesh(new THREE.SphereGeometry(0.065, 24, 18), K.mat('rope', { u: { uTwist: 900, uCol: [[0.5, 0.04, 0.03], [0.05, 0.07, 0.28], [0.7, 0.45, 0.08], [0.65, 0.58, 0.42], [0.3, 0.16, 0.08]][i] } }), sc, at(-1.25 + 0.09 * Math.cos(i * 1.3), 3.4 + 0.09 * Math.sin(i * 1.3), 0.12 + 0.04 * (i % 2))); }
    const per = 0.73, T = 114.6;
    return { update(t) { R.hearth.set(t); const q = (t - T) / per, n = Math.floor(q), f = q - n; const step = 0.0285, beat = ease.inOut3((f - 0.62) / 0.12), top = 0.34 + step * (n + beat); cm.userData.u.uTop.value = top; const y = b[1] + 0.335 + top * 1.45; const dirn = n % 2 ? 1 : -1, fl = ease.inOut3((f - 0.02) / 0.42), x = dirn * (-0.86 + 1.72 * fl); shut.position.set(b[0] + x, y + 0.055 + 0.01 * Math.sin(fl * 3.14), b[2] + 0.066); shut.rotation.z = -0.06 * Math.cos(fl * 3.14) * dirn;
      const drop = f < 0.5 ? 0.16 : f < 0.62 ? 0.16 + 0.05 * Math.sin((f - 0.5) / 0.12 * Math.PI * 0.5) : f < 0.74 ? 0.21 * (1 - Math.pow((f - 0.62) / 0.12, 2)) : 0.16 * ease.inOut3((f - 0.80) / 0.2) + 0.012 * Math.abs(Math.sin((f - 0.74) * 50)) * Math.exp(-(f - 0.74) * 30); bat.position.set(b[0], y + 0.045 + drop, b[2] + 0.085); bat.rotation.x = -0.1 * drop; cl.rotation.x = 0.004 * g(t, T + n * per + 0.74 * per, 0.02, 0.0, 0.2);
      weft.set((u) => [b[0] - dirn * 0.6 + (x + dirn * 0.6) * u, y + 0.01 + 0.045 * u, b[2] + 0.062], 1); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.3, 1.45, 4.75], [0.8, 1.35, 4.55], [0.1, 1.30, 4.5]], look: [[0, 1.12, 2.8], [0, 1.12, 2.8], [0, 1.14, 2.8]], fov: [40, 36], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.006, focus: 1.9 }),
});
