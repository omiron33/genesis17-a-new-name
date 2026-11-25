// The clay round is tied to the tall staff; it swings, turns its mark to the lamp, and hangs.
export const kind = 'three';
import { shot, THREE, ring, br, rise } from '/song/lib/shot.js';
import { camp, at, K, flames, flick } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s63-the-tall-staff', {
  sky: { hour: 'dusk', az: 200, moonAz: 60, moonEl: 34, extent: 8, center: [0, 1.4, 2.4], gust: 0.35, skyK: 1.4, sunK: 2.4, envK: 1.2 },
  build(S) {
    const R = camp(S, { at: [0, 0], n: 24000, r: 9, tents: 2, far: 320, hearth: { I: 24, smokeCol: [0.2, 0.18, 0.22] }, jars: true }), sc = S.scene, p = at(0, 2.4); K.staff(sc, { p, h: 1.85 }); const piv = new THREE.Group(); piv.position.set(p[0] + 0.235, p[1] + 1.690, p[2]); sc.add(piv); const tk = K.token(piv, [0, -0.33, 0], { r: 0.10, mark: 1 }); tk.mesh.rotation.x = Math.PI / 2; const C = K.coveCord(piv, { n: 90, r: 0.0055, turns: 16 }), C2 = K.coveCord(piv, { n: 160, r: 0.0055, turns: 40 }); K.slab(sc, at(0.95, 2.6, -0.05), { w: 0.5, d: 0.45, h: 1.05, seed: 51, tint: 0.6 }); const lb = K.lampBody(sc, at(0.82, 2.65, 0.93), { s: 1.3, rot: 2.8 }), F = flames(sc, [{ p: lb.tip(), h: 0.11 }]), l = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 1.6, 0, 2); const q = lb.tip(); l.position.set(q[0] - 0.02, q[1] + 0.08, q[2] + 0.04); sc.add(l);
    return { update(t) { R.hearth.set(t); F.set(0, flick(t, 1)); l.intensity = 1.9 * flick(t, 1); { const up = 1 - Math.pow(1 - Math.min(1, Math.max(0, (t - 300.5) / 0.9)), 3); tk.mesh.position.y = -0.33 - 0.42 * (1 - up); } piv.rotation.z = 0.26 * ring(t, 301.35, 0.62, 0.45) + 0.02 * br(t); piv.rotation.y = 1.3 * Math.exp(-(t - 300.5) * 0.9) * Math.cos((t - 300.5) * 1.6) + 0.10; C.set((u) => [0.014 * Math.sin(u * 3.14), (tk.mesh.position.y + 0.095) * u, 0], { k: 1.0 }); { const w = Math.min(1, Math.max(0, (t - 300.65) / 1.1)); C2.set((u) => { const a = u * 6.283 * 4 + 1.2; return [-0.012 + 0.05 * (u - 0.5), 0.012 + Math.sin(a) * 0.030, Math.cos(a) * 0.030]; }, { k: 1.0, showA: w, showB: w, open: () => 0.005 }); } tk.set(1, 0.05 + 0.55 * rise(t, 301.6, 0.9)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.15, 1.05, 3.35], [0.85, 1.12, 3.3], [0.45, 1.25, 3.3]], look: [[0.32, 1.40, 2.4], [0.30, 1.42, 2.4], [0.28, 1.42, 2.4]], fov: [38, 32], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.008, focus: 1.25 }),
});
