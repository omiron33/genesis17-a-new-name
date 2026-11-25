// Close: the cord of flax and light in a loose knot; on "keep" it draws tight, and light goes through it and holds.
export const kind = 'three';
import { shot, THREE, ease, g } from '/song/lib/shot.js';
import { camp, at, K } from '/song/lib/sets.js';
import { rig, spring } from '/kit/motion.js';
// heights that carry the cord over and under itself, by the parameter of the trefoil's open curve
const ZK = [[-2.5, 0], [-2.2, -0.5], [-1.95, -1], [-1.70, 1], [-1.1, 0.2], [-0.518, -1], [0, 0], [0.518, 1], [1.1, -0.2], [1.70, -1], [1.95, 1], [2.2, 0.5], [2.5, 0]];
const zAt = (t) => { if (t <= ZK[0][0] || t >= ZK[12][0]) return 0; let i = 0; while (t > ZK[i + 1][0]) i++; const k = (t - ZK[i][0]) / (ZK[i + 1][0] - ZK[i][0]), q = k * k * (3 - 2 * k); return ZK[i][1] + (ZK[i + 1][1] - ZK[i][1]) * q; };
export default shot('s15-keep', {
  sky: { hour: 'morning', az: 112, extent: 2.4, center: [0, 1.4, 2.4], gust: 0.5, el: 22 },
  build(S) {
    const R = camp(S, { at: [0, -1], n: 16000, r: 9, tents: 1, flowers: 160, far: 260, hearth: true }), sc = S.scene; const C = K.coveCord(sc, { n: 420, r: 0.0125, turns: 34 }); const l = new THREE.PointLight(new THREE.Color(1, 0.72, 0.36), 0.2, 0, 2); sc.add(l);
    const knot = (k, hum) => { const s = 0.066 - 0.0445 * k, z = 0.031 - 0.004 * k, P = [], T = 2.06; const end = (sg) => { const x = 2.5 * s + 0.06; return [[sg * (x + 0.10 + 0.05 * (1 - k)), 2.1 * s], [sg * (x + 0.34), 2.0 * s - 0.03 * (1 - k)], [sg * (x + 0.75), 1.7 * s - 0.05 * (1 - k)], [sg * (x + 1.3), 1.4 * s - 0.06 * (1 - k)]]; }; const put = (x, y, zz) => P.push(new THREE.Vector3(x, 1.46 + y + hum, 2.5 + zz)); end(-1).reverse().forEach(([x, y]) => put(x, y, 0)); for (let i = 0; i <= 64; i++) { const t = -T + 2 * T * i / 64; put((t * t * t - 3 * t) * s, (t * t * t * t - 4 * t * t) * s, zAt(t) * z); } end(1).forEach(([x, y]) => put(x, y, 0)); const c = new THREE.CatmullRomCurve3(P, false, 'centripetal'); c.arcLengthDivisions = 500; return c; };
    return { update(t) { R.hearth.set(t); const k = 0.22 * ease.inOut3((t - 68.45) / 0.5) - 0.14 * g(t, 68.75, 0.28, 0.02, 0.12) + 0.62 * spring(t, 69.0, { freq: 0.85, damping: 0.58 }) + 0.16 * ease.inOut3((t - 69.9) / 1.0); const hum = 0.003 * Math.sin(t * 60) * Math.exp(-(t - 69.4) * 2.2) * (t > 69.4 ? 1 : 0); const c = knot(Math.min(1.03, k), hum); C.set((u) => { const p = c.getPointAt(Math.min(1, Math.max(0, u))); return [p.x, p.y, p.z]; }, { k: 0.75 + 0.55 * g(t, 69.15, 0.25, 0.2, 1.2) + 0.5 * g(t, 70.85, 0.3, 0.3, 1.2), open: () => 0.0115 }); l.position.set(0, 1.42, 2.78); l.intensity = 0.10 + 0.20 * g(t, 69.15, 0.25, 0.2, 1.5); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.40, 1.60, 3.62], [0.12, 1.54, 3.46], [-0.18, 1.50, 3.28]], look: [[0, 1.38, 2.5], [0, 1.40, 2.5], [0, 1.43, 2.5]], fov: [34, 31], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.007, focus: 1.0 }),
});
