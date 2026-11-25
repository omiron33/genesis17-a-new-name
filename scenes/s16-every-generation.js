// Along a wall of lamps: one flame passes to the next, and the next, as far as the eye goes.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances, rockGeo } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s16-every-generation', {
  sky: { hour: 'sunrise', az: 168, extent: 9, center: [3, 1, 1], gust: 0.35, skyK: 0.75, sunK: 0.55, envK: 0.75, el: 5 },
  build(S) {
    const R = camp(S, { at: [2, 2], n: 36000, r: 11, tents: 2, oak: true, hearth: { I: 12, smokeCol: [0.22, 0.2, 0.26] } }), sc = S.scene, r = rng(3), sets = [[], [], []];
    const path = (u) => [-1.4 + 13 * u, 4.2 - 5.5 * u + 2.2 * u * u + 0.4 * Math.sin(u * 6)];
    for (let i = 0; i < 64; i++) { const [x, z] = path(i / 63); for (let k = 0; k < 3; k++) { const s = 0.18 + 0.07 * r(); sets[(i + k) % 3].push({ p: [x + (r() - 0.5) * 0.1, G(x, z) + 0.10 + k * 0.21, z + (r() - 0.5) * 0.12], s: [s * 1.2, s * 0.75, s * 1.2], r: [(r() - 0.5) * 0.4, r() * 6, (r() - 0.5) * 0.4] }); } if (i % 2 === 0) { } }
    sets.forEach((q, i) => instances(sc, rockGeo(60 + i, 3, 0.8), K.mat('limestone', { uvless: true }), q));
    const N = 30, pos = [...Array(N)].map((_, i) => { const u = i / (N - 1); const [x, z] = path(0.03 + 0.95 * u); return [x, G(x, z) + 0.685, z]; }); const lamps = instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), pos.map((p) => ({ p, s: 1.25, r: [0, 2.2, 0] })));
    const rot = (p) => [p[0] + Math.cos(2.2) * 0.1025, p[1] + 0.0625, p[2] - Math.sin(2.2) * 0.1025]; const F = flames(sc, pos.map((p, i) => ({ p: rot(p), h: 0.12, seed: i * 1.7 }))); const L = [0, 1, 2, 3, 4].map(() => { const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 0, 0, 2); sc.add(l); return l; });
    return { update(t) { R.hearth.set(t); const T = (i) => 72.2 + 4.3 * Math.pow(i / N, 0.85); const lit = pos.map((p, i) => i < 2 ? 1 : spring(t, T(i), { freq: 2.6, damping: 0.4 })); lit.forEach((k, i) => F.set(i, Math.max(0, k) * flick(t, i))); L.forEach((l, j) => { const a = j * 3, p = pos[Math.min(N - 1, a + 1)], k = (lit[a] + lit[a + 1] + lit[a + 2]) / 3; l.position.set(p[0] + 0.1, p[1] + 0.28, p[2] + 0.12); l.intensity = 1.5 * Math.max(0, k) * flick(t, j); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.9, 1.18, 5.5], [-0.2, 1.14, 5.1], [1.8, 1.16, 4.3]], look: [[1.0, 0.75, 3.2], [2.8, 0.75, 2.4], [5.2, 0.72, 1.6]], fov: [44, 42], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.008, focus: 1.9 }),
});
