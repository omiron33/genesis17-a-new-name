// Sunrise: flax winds up the staff from its foot, light winds down from its hook, each in its own lane, till the two lie side by side.
export const kind = 'three';
import { shot, THREE, rise, g } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s08-covenant-with-you', {
  sky: { hour: 'sunrise', az: 128, extent: 6, center: [0, 1.2, 2], gust: 0.55, el: 8 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 42000, r: 10, hearth: true, jars: true, altar: true }); const p = at(0, 2.4); K.staff(S.scene, { p, wrap: false, h: 1.6 });
    const LM = K.lightMat(0.8), A = K.liveTube(S.scene, K.flaxMat(), { n: 700, r: 0.0125, S: 12 }), B = K.liveTube(S.scene, LM, { n: 700, r: 0.0125, S: 12 }), l = new THREE.PointLight(new THREE.Color(1, 0.72, 0.36), 0.35, 0, 2); S.scene.add(l);
    const N = 9, y0 = 0.16, y1 = 1.26, RW = 0.0375, hel = (v, off) => { const a = v * N * 6.283, y = y0 + (y1 - y0) * v + off, e = K.staffCentre(y, 1.6); return [p[0] + e[0] + Math.cos(a) * RW, p[1] + y, p[2] + e[2] + Math.sin(a) * RW]; }, lane = (y1 - y0) / N / 2;
    // flax: a tail along the ground, then up; light: a strand from above, then down
    const fa = (u) => { const q = 0.14; if (u < q) { const k = u / q, h = hel(0, 0), m = 1 - k; return [h[0] + 0.85 * m * m, Math.max(p[1] + 0.02, h[1] * 1 - 0.14 * m - 0.02 * m), h[2] + 0.35 * m + 0.05 * Math.sin(m * 7)]; } return hel((u - q) / (1 - q), 0); };
    const fb = (u) => { const q = 0.14; if (u < q) { const k = u / q, h = hel(1, lane), m = 1 - k; return [h[0] - 0.10 * m + 0.35 * m * m, h[1] + 1.3 * m, h[2] - 0.15 * m * m]; } return hel(1 - (u - q) / (1 - q), lane); };
    return { update(t) { R.hearth.set(t); const k = Math.min(1, Math.max(0, (t - 38.8) / 4.9)), s = 0.16 + 0.84 * k * (1.15 - 0.15 * k); A.set(fa, s); B.set(fb, s); LM.userData.setK(0.75 + 0.7 * g(t, 42.0, 0.5, 0.6, 1.4)); const q = fb(s); l.position.set(q[0] + 0.10, q[1], q[2] + 0.22); l.intensity = 0.25 + 0.3 * rise(t, 42.0, 0.8); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.1, 1.00, 4.7], [-0.4, 1.02, 4.6], [0.6, 1.10, 4.35]], look: [[0.10, 0.82, 2.4], [0.10, 0.84, 2.4], [0.10, 0.86, 2.4]], fov: [42, 39], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.005, focus: 2.25 }),
});
