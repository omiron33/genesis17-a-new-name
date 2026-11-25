// A ring of staffs of every height and wood about the fire, every one with its sign turning in the firelight.
export const kind = 'three';
import { shot, THREE, br } from '/song/lib/shot.js';
import { camp, at, G, K, hearth, flick } from '/song/lib/sets.js';
import { M } from '/song/lib/core.js';
import { rig } from '/kit/motion.js';
export default shot('s67-every-man-ring', {
  sky: { hour: 'dusk', az: 200, moonAz: 60, moonEl: 34, extent: 9, center: [0, 1, 1.5], gust: 0.35, skyK: 1.3, sunK: 2.0, envK: 1.1, rot: 0.6 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 40000, r: 11, tents: 3, jars: true, altar: false, spots: [[0, 1.5, 4.0]] }), sc = S.scene, H = hearth(S, at(0, 1.5), { I: 40, shadow: true, gain: 0.7, smokeCol: [0.22, 0.2, 0.24] }); const N = 16, piv = [...Array(N)].map((_, i) => { const a = i / N * 6.283 + 0.2, r = 2.5 + 0.25 * Math.sin(i * 2.7), x = Math.cos(a) * r, z = 1.5 + Math.sin(a) * r, h = 1.05 + 0.8 * ((i * 0.618) % 1), hk = i % 3 !== 1; const s = K.staff(sc, { p: at(x, z), h, seed: 2 + i, hook: hk, wood: i % 2 ? 'paleWood' : 'wood', wrap: i % 4 === 0 }); s.rotation.y = -a + Math.PI * 0.5; const g0 = new THREE.Group(); g0.position.set(hk ? h * 0.127 : 0.035, h * (hk ? 0.915 : 0.95), 0.0); s.add(g0); const tk = K.token(g0, [0, -0.25, 0], { r: 0.075, mark: 1 }); tk.mesh.rotation.x = Math.PI / 2; K.mesh(K.sweep([K.V(0, 0, 0), K.V(0, -0.18, 0)], 0.005, { S: 6 }), K.flaxMat(), g0); tk.set(1, 0.35); return { g0, tk }; });
    return { update(t) { H.set(t); piv.forEach((p, i) => { p.g0.rotation.y = 1.1 * Math.sin(t * 0.9 + i * 1.7); p.g0.rotation.z = 0.10 * Math.sin(t * 1.9 + i); p.tk.set(1, 0.5 + 0.6 * Math.exp(-Math.pow(((t - 322.6) * 6 - i * 0.9) / 3.0, 2)) * 1.6); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-3.6, 1.35, 5.4], [-1.4, 1.35, 6.4], [1.2, 1.5, 6.4]], look: [[0, 0.95, 1.5], [0, 0.95, 1.5], [0, 0.95, 1.5]], fov: [44, 44], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.003, focus: 4.2 }),
});
