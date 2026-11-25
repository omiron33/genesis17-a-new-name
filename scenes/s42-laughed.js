// The staff falls on its face under the oak, and on "laughed" the goat bells hung in the bough leap and shake, and the whole oak with them.
export const kind = 'three';
import { shot, THREE, br, ring, g } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { camp, at, G, K, falls } from '/song/lib/sets.js';
import { puff } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s42-laughed', {
  sky: { hour: 'afternoon', az: 60, extent: 8, center: [0, 1.4, -1.6], gust: 0.5, el: 30 },
  build(S) {
    const R = camp(S, { at: [0, 0], n: 34000, r: 9, tents: 2, jars: true, hearth: true, flowers: 300, spots: [[0, -1.2, 3.0]] }), sc = S.scene, X = -1.15, Z = -1.35; const st = K.staff(sc, { p: at(X, Z) }); const d = puff(sc, { at: (h) => at(X + 1.7 * h, Z + 0.05), t0: 202.62, n: 60, size: 0.26, spread: 0.7, a: 0.22 });
    const N = 9, bells = [...Array(N)].map((_, i) => { const x = -1.75 + 3.7 * i / (N - 1) + 0.12 * Math.sin(i * 2.7), y = 2.02 + 0.30 * Math.sin(i * 1.9 + 0.6), z = -2.5 + 0.35 * Math.cos(i * 2.2), p = new THREE.Group(); p.position.set(x, 4.1, z); sc.add(p); K.mesh(K.sweep([K.V(0, 0, 0), K.V(0.01, (y - 4.1) * 0.5, 0.0), K.V(0, y - 4.1, 0)], 0.006, { S: 6 }), K.flaxMat(), p); const b = K.bell(p, [0, y - 4.1, 0], { s: 2.0 + 0.7 * ((i * 0.618) % 1), mt: i % 3 === 1 ? 'gold' : 'bronze' }); return { p, b, dl: 0.018 * Math.abs(i - 4), f: 2.4 + 0.13 * (i % 4) }; });
    const peal = (t) => Math.abs(ring(t, 203.28, 3.2, 1.5));
    return { update(t) { R.hearth.set(t); K.lean(st, 0.02 - 0.07 * g(t, 201.55, 0.3, 0.02, 0.1) + falls(t, 201.95, 0.68) * 0.985 - 0.06 * peal(t), Math.PI / 2 - 0.10); st.position.y = G(X, Z) + 0.02 + 0.05 * peal(t); d.set(t); U.uGust.value = 0.5 + 2.6 * g(t, 203.2, 0.12, 0.4, 0.8); bells.forEach((q, i) => { const t0 = 203.22 + q.dl; q.p.rotation.z = 0.13 * ring(t, t0, 1.3 + 0.1 * (i % 3), 0.7) + 0.012 * br(t + i); q.p.rotation.x = 0.09 * ring(t, t0 + 0.05, 1.5, 0.7); q.b.set(1.05 * ring(t, t0, q.f, 0.8) + 0.03 * br(t + i * 2), 1.35 * ring(t, t0 + 0.06, q.f, 0.6)); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.0, 0.95, 3.1], [-0.4, 0.95, 2.8], [0.4, 1.0, 2.45]], look: [[0.0, 0.62, -2.0], [0.0, 0.66, -2.0], [0.1, 0.72, -2.0]], fov: [48, 46], enter: 'moving', exit: 'moving', handheld: 0.12 }),
});
