// In the tent the staffs of the house stand in a row, old to young; a hung lamp swings, and their shadows sweep the curtain.
export const kind = 'three';
import { shot, THREE, ring, g } from '/song/lib/shot.js';
import { inside, at, G, K, flame, flick } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s30-born-in-house', {
  sky: { hour: 'noon', az: 170, extent: 9, center: [0, 1, 0], gust: 0.4, el: 34, envK: 0.40, skyK: 0.9, sunK: 0.6 }, exposure: 1.25,
  build(S) {
    const I = inside(S, { fill: 0.22 }), sc = S.scene; const D = [[-1.35, 1.30, 2, 'wood'], [-0.75, 1.08, 7, 'paleWood'], [-0.18, 0.86, 11, 'paleWood'], [0.34, 0.66, 15, 'wood'], [0.80, 0.50, 19, 'paleWood'], [1.20, 0.38, 23, 'paleWood']]; const st = D.map(([x, h, sd, w], i) => { const s = K.staff(sc, { p: at(x, -1.25 + 0.08 * Math.sin(i * 2.3)), h, seed: sd, wood: w, wrap: i < 3 }); K.lean(s, 0.03 + 0.02 * Math.sin(i * 1.7), i * 1.3); return s; });
    const piv = new THREE.Group(); piv.position.set(0.05, G(0, 0) + 1.62, 0.30); sc.add(piv); for (const a of [0, 2.09, 4.19]) K.mesh(K.sweep([K.V(0, 0.4, 0), K.V(0, 0, 0), K.V(Math.cos(a) * 0.05, -0.60, Math.sin(a) * 0.05)], 0.004, { S: 6 }), K.mat('plain', { uvless: true, surf: 'alb = vec3(.012, .009, .006); rough = .9;' }, 'lampcord'), piv); const lb = K.lampBody(piv, [0, -0.66, 0], { s: 1.2, rot: 2.6 }); const tip = new THREE.Vector3(); const f = flame(sc, [0, 1, 0], { h: 0.10, w: 0.045 }), l = new THREE.PointLight(new THREE.Color(1, 0.64, 0.30), 9, 0, 2); l.castShadow = true; l.shadow.mapSize.set(1024, 1024); Object.assign(l.shadow, { bias: -0.002, normalBias: 0.015, radius: 3 }); l.shadow.camera.near = 0.08; l.shadow.camera.far = 9; sc.add(l);
    return { update(t) { piv.rotation.z = 0.62 * Math.sin(2 * Math.PI * 0.40 * (t - 136.1)) * Math.exp(-(t - 136.1) * 0.10); piv.rotation.x = 0.06 * Math.sin(2 * Math.PI * 0.40 * (t - 136.1) + 1.1); piv.updateMatrixWorld(true); const w = lb.tip(); f.set(flick(t, 2), w, [-piv.rotation.z * 0.6, 0]); l.position.set(w[0], w[1] + 0.07, w[2] + 0.02); l.intensity = 17 * flick(t, 2); st.forEach((s, i) => { s.rotation.y = 0.04 * Math.sin(t * 1.3 + i); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.9, 0.95, 1.9], [0.4, 0.92, 1.85], [-0.3, 0.95, 1.6]], look: [[-0.1, 0.62, -1.3], [-0.12, 0.62, -1.3], [-0.15, 0.62, -1.3]], fov: [46, 44], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.004, focus: 3.2 }),
});
