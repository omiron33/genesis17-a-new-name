// A round of clay on the short staff; the indigo cloth folds over it in the evening air.
export const kind = 'three';
import { shot, THREE, ring, br, rise, g } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { ismael, hookPoint } from '/song/lib/cast.js';
import { rig } from '/kit/motion.js';
export default shot('s65-the-short-staff', {
  sky: { hour: 'dusk', az: 165, moonAz: 300, moonEl: 34, extent: 8, center: [0, 1, 2.6], gust: 0.35, skyK: 1.4, sunK: 2.4, envK: 1.25 },
  build(S, P) {
    const R = camp(S, { at: [0, 0], n: 26000, r: 9, tents: 2, far: 320, hearth: { I: 24, smokeCol: [0.2, 0.18, 0.22] }, jars: true, altar: true }), sc = S.scene, p = at(0, 2.6), y = p[1]; const piv = new THREE.Group(); const hp = hookPoint(2.75, 1.3, 11); piv.position.set(p[0] + hp[0], y + hp[1], p[2] + hp[2]); sc.add(piv); const tk = K.token(piv, [0, -0.30, 0.0], { r: 0.085, mark: 1 }); tk.mesh.rotation.x = Math.PI / 2; const C = K.coveCord(piv, { n: 80, r: 0.005, turns: 14 }), C2 = K.coveCord(piv, { n: 160, r: 0.005, turns: 40 });
    const I = ismael(S, P, { x: 0, z: 2.6, h: 1.3, dir: -1, at: 0.80, w: 0.72, ch: 0.40, wind: (t) => [-1.4 * br(t) * (1 - rise(t, 310.4, 1.0)) + 2.2 * rise(t, 310.6, 1.4), 0.2, 0.9 * br(t + 3) + 1.2 * rise(t, 310.4, 1.0) - 1.6 * rise(t, 311.6, 0.8)] });
    K.slab(sc, at(1.25, 2.3, -0.05), { w: 0.45, d: 0.42, h: 0.60, seed: 53, tint: 0.6 }); const lb = K.lampBody(sc, at(1.14, 2.4, 0.49), { s: 1.3, rot: 2.8 }), F = flames(sc, [{ p: lb.tip(), h: 0.11 }]), l = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 1.6, 0, 2); const q = lb.tip(); l.position.set(q[0], q[1] + 0.08, q[2] + 0.05); sc.add(l);
    return { update(t) { R.hearth.set(t); I.set(t); F.set(0, flick(t, 1)); l.intensity = 1.5 * flick(t, 1); piv.rotation.z = 0.30 * ring(t, 308.9, 0.70, 0.5) + 0.02 * br(t); piv.rotation.y = 0.8 * Math.exp(-(t - 309) * 0.8) * Math.cos((t - 309) * 1.8); C.set((u) => [0.012 * Math.sin(u * 3.14), -0.22 * u, 0], { k: 1.0 }); C2.set((u) => { const a = u * 6.283 * 3 + 1.2; return [Math.cos(a) * 0.026, 0.020 * (u - 0.4), Math.sin(a) * 0.026]; }, { k: 1.0, open: () => 0.0045 }); tk.set(1, 0.10 + 0.7 * rise(t, 310.3, 0.8)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.95, 0.80, 4.6], [0.5, 0.84, 4.5], [0.0, 0.95, 4.3]], look: [[0.0, 1.0, 2.6], [0.02, 1.0, 2.6], [0.04, 1.0, 2.6]], fov: [38, 35], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.007, focus: 2.0 }),
});
