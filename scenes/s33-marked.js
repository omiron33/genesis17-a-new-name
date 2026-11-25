// Very close: the seal leaves the clay, and the mark stays, glowing in the dark earth as the camera goes round it.
export const kind = 'three';
import { shot, THREE, ease, g, rise } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s33-marked', {
  sky: { hour: 'afternoon', az: 100, extent: 8, center: [0, 1, 2.2], gust: 0.4, el: 24, sunK: 0.8 }, exposure: 0.8,
  grad: 0.66,
  build(S) {
    const R = bench(S, { bz: 2.2, jars: true, hearth: true, tint: 0.4, bseed: 12 }), y = R.top, sc = S.scene; const tk = K.token(sc, [0, y + 0.062, 2.3], { r: 0.17, mark: 0, dry: 0 }); tk.mesh.scale.y = 2.0; K.mesh(new THREE.BoxGeometry(0.62, 0.03, 0.46, 20, 2, 16), K.mat('wood', { uvless: true }), sc, [0, y + 0.026, 2.3]).rotation.y = 0.25;
    const st = K.discSeal(sc, { r: 0.158 }); const l = new THREE.PointLight(new THREE.Color(1, 0.7, 0.3), 0, 0, 2); sc.add(l); l.position.set(0, y + 0.24, 2.34); const Gy = glory(sc, { from: [0.8, 9, 0.2], to: [0, y, 2.3], angle: 0.06, I: 160, air: 1.6 });
    return { update(t) { R.hearth.set(t); const d = t - 154.0, dn = t < 154.0 ? 0.12 * (1 - Math.pow(Math.min(1, Math.max(0, (t - 153.35) / 0.65)), 2.4)) : 0; const up = ease.inOut3((t - 154.75) / 1.1); st.position.set(0.0 + 0.5 * up * up, y + 0.090 + dn + 0.75 * up, 2.3 - 0.1 * up); st.rotation.z = -0.5 * up + 0.02 * Math.sin(t * 20) * (d > 0 && d < 0.7 ? 1 : 0); const k = rise(t, 155.1, 0.7); tk.set(t > 154.0 ? 1 : 0, 0.10 + 0.75 * k + 0.35 * g(t, 155.4, 0.3, 0.3, 1.6)); tk.mesh.scale.set(1 + 0.03 * Math.min(1, Math.max(0, d * 6)), 2.0 - 0.25 * Math.min(1, Math.max(0, d * 6)), 1 + 0.03 * Math.min(1, Math.max(0, d * 6))); l.intensity = 0.12 * k; Gy.set(t, 0.3 + 0.9 * k); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.65, 1.14, 3.1], [-0.1, 1.16, 3.2], [0.55, 1.22, 2.95], [0.75, 1.28, 2.6]], look: [[0, 0.72, 2.3], [0, 0.68, 2.3], [0, 0.65, 2.3], [0, 0.64, 2.3]], fov: [34, 27], enter: 'moving', exit: 'moving', handheld: 0.04, aperture: 0.006, focus: 0.85 }),
});
