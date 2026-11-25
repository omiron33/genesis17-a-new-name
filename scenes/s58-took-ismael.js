// Two lines of footprints, a man's and a boy's, pressed one after another into the dust, two staff marks beside them.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { PRINT_HEAD, PRINT_SURF, walk } from '/song/lib/prints.js';
import { ismael } from '/song/lib/cast.js';
import { puff } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
const A = walk([[-1.0, 5.6], [-0.7, 3.4], [-1.1, 0.4]], { stride: 0.50, gauge: 0.10, t0: 278.5, dt: 0.34, n: 11 }), B = walk([[0.1, 5.75], [0.3, 3.4], [-0.1, 0.4]], { stride: 0.40, child: true, t0: 278.65, dt: 0.27, n: 13 }); const all = [...A, ...B];
export default shot('s58-took-ismael', {
  sky: { hour: 'sunset', az: 100, extent: 8, center: [-0.3, 0.6, 3], gust: 0.4, el: 10, skyK: 0.75, sunK: 2.0 },
  build(S, P) {
    const arr = new Float32Array(26 * 4); all.forEach((p, i) => arr.set([p.x, p.z, p.a + (p.child ? 100 * Math.sign(p.a || 1) : 0), 0], i * 4)); const R = camp(S, { at: [0, 1], n: 30000, r: 10, tents: 2, jars: true, hearth: { I: 8 }, spots: [[-0.3, 3, 3.6]], landU: { uPrints: arr }, landHead: PRINT_HEAD(26, 1.4), surf: PRINT_SURF }), sc = S.scene;
    const st = K.staff(sc, { p: at(-1.6, 3.4) }); const puffs = all.slice(0, 22).map((p, i) => puff(sc, { at: at(p.x, p.z), t0: p.t, n: 8, size: 0.09, spread: 0.18, a: 0.14, life: 0.8, seed: i })); const hop = (t, t0, per, x, z0, dz) => { const q = (t - t0) / per, n = Math.max(0, Math.floor(q)), f = Math.max(0, q - n), k = f < 0.45 ? 0 : (f - 0.45) / 0.55, e = k * k * (3 - 2 * k); return [x, z0 - dz * (n + e), 0.10 * Math.sin(Math.PI * k), f < 0.45 ? 0.10 - 0.20 * f / 0.45 : -0.10 + 0.20 * e]; }; const hb = (t) => hop(t, 278.5, 0.72, 0.62, 5.0, 0.86); const I = ismael(S, P, { x: 0.62, z: 3.2, h: 1.2, az: Math.PI, tilt: (t) => -0.02 - hb(t)[3], foot: (t) => { const b = hb(t); return [b[0], G(b[0], b[1]) + b[2] * 0.8, b[1]]; }, wind: (t) => [1.2, 0.1, 0.8] });
    return { update(t) { R.hearth.set(t); all.forEach((p, i) => { arr[i * 4 + 3] = Math.min(1, Math.max(0, (t - p.t) / 0.09)) * 0.75; }); puffs.forEach((p) => p.set(t)); const a = hop(t, 278.3, 0.86, -1.55, 4.9, 1.1); st.position.set(a[0], G(a[0], a[1]) + a[2], a[1]); K.lean(st, 0.02 + a[3], Math.PI); I.set(t); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.7, 1.75, 7.6], [0.3, 1.85, 7.0], [-0.1, 2.0, 6.4]], look: [[-0.4, 0.15, 3.6], [-0.4, 0.10, 3.0], [-0.4, 0.1, 2.4]], fov: [44, 42], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.004, focus: 3.2 }),
});
