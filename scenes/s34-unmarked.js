// The light passes along the row of rounds and each answers; one, blank, does not.
export const kind = 'three';
import { shot, THREE, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s34-unmarked', {
  sky: { hour: 'afternoon', az: 120, extent: 8, center: [0, 1.4, 2.4], gust: 0.4, el: 26, sunK: 0.6, skyK: 0.9 }, exposure: 0.9,
  build(S) {
    const R = camp(S, { at: [0, 0], n: 24000, r: 9, tents: 2, far: 300, jars: true, hearth: true }), sc = S.scene, b = at(0, 2.5); K.line(sc, [-2.1, b[1] + 1.72, 2.5], [2.1, b[1] + 1.72, 2.5], { r: 0.014, sag: 0.06 });
    const N = 8, piv = [...Array(N)].map((_, i) => { const x = -1.42 + 2.84 * i / (N - 1); const g0 = new THREE.Group(); g0.position.set(x, b[1] + 1.72 - 0.06 * (1 - Math.pow(x / 2.1, 2)), 2.5); sc.add(g0); K.mesh(K.sweep([K.V(0, 0, 0), K.V(0.004, -0.12, 0), K.V(0, -0.24 - 0.03 * (i % 2), 0)], 0.006, { S: 7 }), K.flaxMat(), g0); const tk = K.token(g0, [0, -0.35 - 0.03 * (i % 2), 0], { r: 0.115, mark: i === 5 ? 0 : 1 }); tk.mesh.rotation.x = Math.PI / 2; return { g0, tk, x }; });
    const l = new THREE.PointLight(new THREE.Color(1, 0.74, 0.36), 0.5, 0, 2); sc.add(l); const Gy = glory(sc, { from: [0, 12, 0], to: [0, b[1] + 1.3, 2.5], angle: 0.035, I: 5200, air: 3.0, disc: 0.15 });
    return { update(t) { R.hearth.set(t); const k = (t - 159.4) / 4.7, x = -1.9 + 3.6 * ease.inOut3(k * 0.9 + 0.05); piv.forEach((p, i) => { const d = x - p.x, near = Math.exp(-d * d * 14), past = ease.inOut3(d / 0.25); p.g0.rotation.x = 0.06 * Math.sin(t * 1.7 + i * 1.3) + 0.14 * near * Math.sin(t * 5 + i); p.g0.rotation.y = 0.15 * Math.sin(t * 0.8 + i * 2.1); p.tk.set(i === 5 ? 0 : 1, i === 5 ? 0 : 0.05 + 1.8 * near + 0.30 * past); }); Gy.set(t, 1 - 0.80 * Math.exp(-Math.pow((x - piv[5].x) / 0.26, 2)), [x - 0.9, 12, 0.5], [x, b[1] + 1.3, 2.5]); l.position.set(x, b[1] + 1.45, 2.75); l.intensity = 0.35 * (1 - 0.85 * Math.exp(-Math.pow((x - piv[5].x) / 0.26, 2))); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.9, 1.5, 4.3], [-0.6, 1.46, 4.6], [0.75, 1.42, 4.1]], look: [[-0.75, 1.45, 2.5], [0.05, 1.44, 2.5], [0.62, 1.42, 2.5]], fov: [40, 33], enter: 'moving', exit: 'moving', handheld: 0.07, aperture: 0.007, focus: 2.0 }),
});
