// A row of wet clay rounds on a board; the seal comes down on each on the beat, and each mark lights and cools.
export const kind = 'three';
import { shot, THREE, ease, g, rise } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s26-every-male', {
  sky: { hour: 'noon', az: -58, extent: 8, center: [0, 1, 3.4], gust: 0.4, el: 36 },
  build(S) {
    const R = bench(S, { bz: 3.4, jars: true, hearth: true, tint: 0.5, bseed: 12, bw: 2.4 }), y = R.top, sc = S.scene; K.mesh(new THREE.BoxGeometry(1.85, 0.03, 0.34, 40, 2, 10), K.mat('wood', { uvless: true, surf: 'vec3 q2 = p.yxz; ' }, 'board'), sc, [0.02, y + 0.030, 3.5]);
    const xs = [-0.74, -0.44, -0.15, 0.15, 0.45, 0.75], T = [118.62, 119.36, 120.1, 120.82, 121.35, 121.85]; const tk = xs.map((x, i) => K.token(sc, [x, y + 0.058, 3.5 + 0.012 * Math.sin(i * 2.3)], { r: 0.105, mark: 0, dry: 0 }));
    const st = K.discSeal(sc, { r: 0.098 }); const l = new THREE.PointLight(new THREE.Color(1, 0.7, 0.3), 0, 0, 2); sc.add(l);
    return { update(t) { R.hearth.set(t); let x = xs[0], h = 0.3, i = 0; for (let k = 0; k < 6; k++) if (t >= T[k] - 0.36) i = k; const d = t - T[i]; const px = i ? xs[i - 1] : xs[0] - 0.3; const go = ease.inOut3((d + 0.36) / 0.20); x = px + (xs[i] - px) * go; if (d < 0) h = 0.03 + 0.20 * Math.sin(Math.min(1, Math.max(0, -d / 0.30)) * Math.PI * 0.5); else if (d < 0.08) h = 0.0; else h = 0.20 * ease.out3((d - 0.08) / 0.28); st.position.set(x, y + 0.068 + h, 3.5); st.rotation.z = 0.10 * Math.sin(go * Math.PI) * (i % 2 ? 1 : -1) * 0.6;
      tk.forEach((q, k) => { const e = t - T[k]; q.set(e > 0 ? 1 : 0, e > 0.04 ? 1.5 * Math.exp(-(e - 0.04) * 1.3) + 0.12 : 0); q.mesh.scale.set(1 + 0.05 * (e > 0 ? 1 : 0), 1 - 0.12 * (e > 0 ? 1 : 0), 1 + 0.05 * (e > 0 ? 1 : 0)); }); l.position.set(xs[i], y + 0.16, 3.55); l.intensity = 0.28 * Math.exp(-Math.max(0, d) * 3) * (d > 0 ? 1 : 0); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.95, 1.22, 4.65], [-0.2, 1.22, 4.75], [0.75, 1.24, 4.6]], look: [[-0.35, 0.70, 3.45], [-0.02, 0.70, 3.45], [0.28, 0.70, 3.45]], fov: [40, 40], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.005, focus: 1.3 }),
});
