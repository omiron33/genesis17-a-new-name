// The oak in the new sun: acorns drop, and round it one sapling after another breaks the ground.
export const kind = 'three';
import { shot, THREE, br } from '/song/lib/shot.js';
import { camp, at, G, K, OAK } from '/song/lib/sets.js';
import { grow, branches, sprigGeo, leafMat, leafSpots } from '/song/lib/tree.js';
import { M } from '/song/lib/core.js';
import { rng } from '/song/lib/noise.js';
import { rig, spring, anticipate } from '/kit/motion.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export default shot('s12-father-of-many', {
  sky: { hour: 'morning', az: 70, extent: 15, center: [0, 3, 0], gust: 0.5, el: 20 },
  build(S, P) {
    const R = camp(S, { at: [0, 4], n: 60000, r: 13, tents: 1, flowers: 420 }); const sc = S.scene;
    const st = K.staff(sc, { p: at(0.4, -3.4) }); K.lean(st, 0.06, 1);
    // three sapling shapes, each one geometry of wood and one of leaves
    const shapes = [3, 8, 14].map((sd) => { const N = grow({ seed: sd, n: 170, step: 0.16, reach: 1.1, kill: 0.28, tip: 0.0055, pipe: 2.2, iters: 40, trunk: (add, V) => { let a = -1; for (let i = 0; i < 7; i++) a = add(V(0.03 * Math.sin(i * 1.3 + sd), i * 0.17 - 0.1, 0.03 * Math.cos(i * 1.7 + sd)), a); return 4; }, crown: (r, V) => { const p = V((r() * 2 - 1) * 1.1, 0.8 + r() * 1.9, (r() * 2 - 1) * 1.1), e = Math.hypot(p.x / 1.0, (p.y - 1.7) / 0.95, p.z / 1.0); return e < 1 ? p : null; } });
      const spots = leafSpots(N, { maxR: 0.02, per: 5, jitter: 0.11, size: [0.7, 1.2], seed: sd }); const sg = sprigGeo(5, { L: 0.10, W: 0.032 }), m = new THREE.Matrix4(), q = new THREE.Quaternion(); const ls = spots.map((s) => { q.setFromEuler(new THREE.Euler(...s.r)); m.compose(new THREE.Vector3(...s.p), q, new THREE.Vector3(s.s, s.s, s.s)); return sg.clone().applyMatrix4(m); }); return { wood: branches(N, { minR: 0.0055 }), leaf: mergeGeometries(ls) }; });
    const r = rng(9), list = []; let tr = 0; while (list.length < 46 && tr++ < 900) { const a = r() * 6.283, d = 3.6 + 12 * Math.pow(r(), 0.8), x = OAK[0] + Math.cos(a) * d, z = OAK[1] + Math.sin(a) * d * 1.0 + 1.5; if (z > 6.8 || Math.hypot(x, z - 9.5) < 4.2 || list.some((q) => Math.hypot(q[0] - x, q[1] - z) < 1.35) || Math.hypot(x + 9.2, z + 3.6) < 4.5) continue; list.push([x, z, d, r()]); } list.sort((a, b) => a[2] - b[2]);
    const lm = leafMat({ colA: [0.10, 0.16, 0.035], colB: [0.24, 0.30, 0.08] }); const sets = shapes.map((g, i) => { const L = list.filter((_, k) => k % 3 === i); const mk = (geo, mat) => { const im = new THREE.InstancedMesh(geo, mat, L.length); im.castShadow = im.receiveShadow = true; im.frustumCulled = false; sc.add(im); return im; }; return { L, w: mk(g.wood, K.mat('bark', {}, 'sapBark')), l: mk(g.leaf, lm) }; });
    const m = new THREE.Matrix4(), q = new THREE.Quaternion();
    // acorns
    const ac = new THREE.SphereGeometry(0.035, 12, 10); ac.scale(0.75, 1.25, 0.75); const am = new THREE.InstancedMesh(ac, K.mat('leather', { uvless: true }), 26); am.castShadow = true; am.frustumCulled = false; sc.add(am); const A = [...Array(26)].map(() => ({ x: (r() - 0.5) * 7, z: -1 + r() * 4.5, t0: 55.9 + r() * 3.2, h: 3 + r() * 1.2, e: r() * 6 }));
    return { update(t) {
      sets.forEach((s, i) => { s.L.forEach(([x, z, d, h], k) => { const t0 = 56.5 + (d - 3.6) / 12 * 3.0 + h * 0.5; const sp = Math.max(0.0001, spring(t, t0, { freq: 0.42, damping: 0.62 })), sz = (0.75 + 0.65 * h) * sp; q.setFromEuler(new THREE.Euler(0.05 * Math.sin((t - t0) * 7) * Math.exp(-(t - t0) * 1.6), h * 6.28, 0)); m.compose(new THREE.Vector3(x, G(x, z), z), q, new THREE.Vector3(sz * (0.6 + 0.4 * sp), sz, sz * (0.6 + 0.4 * sp))); s.w.setMatrixAt(k, m); s.l.setMatrixAt(k, m); }); s.w.instanceMatrix.needsUpdate = s.l.instanceMatrix.needsUpdate = true; });
      A.forEach((a, i) => { const d = Math.max(0, t - a.t0), fall = a.h - 4.9 * d * d, g0 = 0.03; let y = fall; if (fall < g0) { const tl = Math.sqrt((a.h - g0) / 4.9), b = d - tl; y = g0 + 0.16 * Math.abs(Math.sin(b * 9)) * Math.exp(-b * 4.5); } q.setFromEuler(new THREE.Euler(a.e + Math.min(d, 1.4) * 6, a.e, 0.4)); m.compose(new THREE.Vector3(a.x, G(a.x, a.z) + y, a.z), q, new THREE.Vector3(1, 1, 1)); am.setMatrixAt(i, m); }); am.instanceMatrix.needsUpdate = true; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[4.2, 1.1, 9.0], [2.2, 1.7, 10.0], [-0.8, 3.0, 11.2]], look: [[0.4, 2.0, -3], [0.2, 2.2, -3.5], [0, 2.4, -4]], fov: [46, 50], enter: 'moving', exit: 'moving', handheld: 0.15 }),
});
