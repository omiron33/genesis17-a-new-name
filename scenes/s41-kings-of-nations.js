// Gold circlets come down, one after another, over the heads of a row of standing staffs, spin, and come to rest.
export const kind = 'three';
import { shot, THREE, br, ring } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s41-kings-of-nations', {
  sky: { hour: 'afternoon', az: 62, extent: 8, center: [0, 1.4, 2.4], gust: 0.6, el: 26 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 40000, r: 10, tents: 2, jars: true, flowers: 320 }), sc = S.scene; const X = [-1.75, -0.95, -0.1, 0.8, 1.7], H = [1.35, 1.75, 1.55, 1.9, 1.45], T = [196.55, 197.0, 197.55, 198.3, 199.75];
    const it = X.map((x, i) => { const z = 2.4 + 0.25 * Math.sin(i * 2.1), y = G(x, z), h = H[i]; const st = K.staff(sc, { p: [x, y, z], h, seed: 3 + i * 4, hook: false, wood: i % 2 ? 'paleWood' : 'wood' }); const top = K.staffCentre(h, h, 3 + i * 4, false); const peg = K.mesh(new THREE.CylinderGeometry(0.128, 0.05, 0.05, 40), K.mat('wood', { uvless: true }), st, [top[0], h - 0.03, top[2]]); const c = K.circlet(sc, { pts: [9, 12, 7, 10, 8][i], R: 0.145 }); return { c, x: x + top[0], z: z + top[2], y: y + h - 0.030, t0: T[i], st }; });
    return { update(t) { it.forEach((o, i) => { const d = t - o.t0, fall = 0.50; let h = 0, spin, tilt; if (d < 0) { const q = Math.min(1, -d / fall); h = 1.9 * q * q + 0.0; spin = -d * 5 + 2.2; tilt = 0.25 * q; } else { const e = Math.exp(-d * 3.0); h = 0.06 * Math.abs(Math.sin(d * 13)) * Math.exp(-d * 6); spin = 2.2 - 1.6 * (1 - Math.exp(-d * 1.8)); tilt = 0.16 * e; } o.c.visible = d > -0.75; if (d < -fall) h = 1.9 + 3 * (-d - fall); const ph = d * 14; o.c.position.set(o.x, o.y + 0.03 + h, o.z); o.c.rotation.set(tilt * Math.cos(ph), spin, tilt * Math.sin(ph)); K.lean(o.st, 0.012 + 0.03 * ring(t, o.t0, 3.4, 3.0), i); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.7, 1.35, 5.6], [-0.2, 1.4, 5.7], [1.4, 1.55, 5.2]], look: [[-0.4, 1.35, 2.4], [0.0, 1.38, 2.4], [0.3, 1.42, 2.4]], fov: [42, 37], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.005, focus: 3.2 }),
});
