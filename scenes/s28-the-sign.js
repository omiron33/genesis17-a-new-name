// A sealed round of clay, strung on the cord, hangs from above; on "sign" its mark lights.
export const kind = 'three';
import { shot, THREE, ease, g, rise, ring, br } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig, spring, follow } from '/kit/motion.js';
export default shot('s28-the-sign', {
  sky: { hour: 'noon', az: 160, extent: 8, center: [0, 1.4, 2.4], gust: 0.5, el: 36 }, exposure: 0.95,
  build(S) {
    const R = camp(S, { at: [0, 0], n: 26000, r: 9, tents: 2, far: 300, jars: true, hearth: true, altar: true }), sc = S.scene, p = at(0, 2.4); const piv = new THREE.Group(); piv.position.set(p[0] + 0.2, p[1] + 1.85, p[2]); sc.add(piv); const tk = K.token(piv, [0, -0.52, 0], { r: 0.13, mark: 1 }); tk.mesh.rotation.x = Math.PI / 2; const C = K.coveCord(sc, { n: 90, r: 0.0055, turns: 16, parent: piv }); const C2 = K.coveCord(sc, { n: 120, r: 0.0055, turns: 30, parent: piv });
    const l = new THREE.PointLight(new THREE.Color(1, 0.72, 0.32), 0, 0, 2); sc.add(l); const Gy = glory(sc, { from: [-1.0, 12, -3], to: [p[0] + 0.2, p[1] + 1.2, p[2]], angle: 0.10, I: 1800, air: 1.3 });
    return { update(t) { R.hearth.set(t); const a = 0.40 * ring(t + 0.2, 125.6, 0.62, 0.34) + 0.02 * br(t); piv.rotation.z = a; piv.rotation.y = 0.55 * Math.cos((t - 125.8) * 1.15) * Math.exp(-(t - 125.8) * 0.22) + 0.05; const la = (q) => 0.40 * ring(q + 0.2, 125.6, 0.62, 0.34), bend = follow(la, t, 0.10) - la(t);
      C.set((u) => [0.014 * Math.sin(u * 3.14) + bend * 0.12 * Math.sin(u * 3.14), -0.39 * u, 0], { k: 1.0 }); C2.set((u) => [0, 2.4 * u, 0], { k: 1.0 }); const k = rise(t, 127.15, 0.7); tk.set(1, 0.05 + 0.75 * k + 0.35 * g(t, 127.2, 0.2, 0.2, 1.2)); const w = piv.localToWorld(new THREE.Vector3(0, -0.52, 0.16)); l.position.copy(w); l.intensity = 0.30 * k; Gy.set(t, 0.3 + 0.8 * k); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.55, 1.42, 3.75], [0.05, 1.40, 3.65], [0.75, 1.44, 3.35]], look: [[0.2, 1.26, 2.4], [0.2, 1.24, 2.4], [0.2, 1.22, 2.4]], fov: [38, 31], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.009, focus: 1.2 }),
});
