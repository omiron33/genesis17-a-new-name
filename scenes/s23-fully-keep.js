// The cord is wound on the staff, and on "fully keep" the turns close up one against the other and bite.
export const kind = 'three';
import { shot, THREE, ease, g } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s23-fully-keep', {
  sky: { hour: 'noon', az: -120, extent: 8, center: [0, 1, 2.4], gust: 0.5, el: 40 },
  build(S) {
    const R = camp(S, { at: [0, 0], n: 22000, r: 9, tents: 2, far: 300, hearth: true, jars: true }), sc = S.scene, p = at(0, 2.4); K.staff(sc, { p, wrap: false });
    const LM = K.lightMat(0.9), A = K.liveTube(sc, K.flaxMat(), { n: 460, r: 0.0125, S: 12 }), B = K.liveTube(sc, LM, { n: 460, r: 0.0125, S: 12 }), l = new THREE.PointLight(new THREE.Color(1, 0.72, 0.36), 0.15, 0, 2); sc.add(l);
    return { update(t) { R.hearth.set(t); const k = spring(t, 107.65, { freq: 1.3, damping: 0.55 }), k2 = spring(t, 108.25, { freq: 1.4, damping: 0.5 }); const N = 6, mid = 1.03, pitch = 0.104 - 0.022 * k - 0.030 * k2, rr = 0.0395 - 0.001 * k - 0.001 * k2; const hel = (v, off) => { const a = v * N * 6.283, y = mid + pitch * (N * (v - 0.5) + off), e = K.staffCentre(y); return [p[0] + e[0] + Math.cos(a) * rr, p[1] + y, p[2] + e[2] + Math.sin(a) * rr]; };
      const strand = (off, sg) => (u) => { if (u < 0.06) { const q = 1 - u / 0.06, e = hel(0, off); return [e[0] + 0.04 * q, e[1] - 0.14 * q * q, e[2] + (0.05 + 0.02 * sg) * q]; } if (u > 0.94) { const q = (u - 0.94) / 0.06, e = hel(1, off); return [e[0] + 0.05 * q, e[1] + 0.05 * q - 0.12 * q * q, e[2] + (0.05 + 0.02 * sg) * q]; } return hel((u - 0.06) / 0.88, off); };
      A.set(strand(0, -1)); B.set(strand(0.5, 1)); LM.userData.setK(0.8 + 0.8 * g(t, 108.25, 0.12, 0.2, 1.2)); l.position.set(p[0] + 0.1, p[1] + 1.0, p[2] + 0.25); l.intensity = 0.08 + 0.2 * g(t, 108.2, 0.2, 0.3, 1.5); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.95, 1.32, 3.15], [0.62, 1.22, 3.3], [0.15, 1.15, 3.35]], look: [[0.02, 1.02, 2.4], [0.02, 1.0, 2.4], [0.02, 0.98, 2.4]], fov: [36, 32], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.004, focus: 1.0 }),
});
