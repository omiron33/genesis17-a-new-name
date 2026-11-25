// The camera goes up from the lamps about the oak into the first stars.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s69-foreigners', {
  sky: { hour: 'stars', az: 200, moonAz: 60, moonEl: 34, extent: 16, center: [0, 3, -3], gust: 0.45, skyK: 1.5, sunK: 1.9, envK: 1.6, cover: 0.12, rot: 0.8 },
  build(S) {
    const R = camp(S, { at: [0, 3], n: 60000, r: 13, tents: 4, hearth: { I: 24, smokeCol: [0.16, 0.16, 0.2] }, jars: true, altar: true, spots: [[0, -6, 4.6]] }), sc = S.scene, r = rng(3); const pos = []; for (let i = 0; i < 46; i++) { const a = i / 46 * 6.283, d = 4.4 + 1.2 * Math.sin(i * 1.9) * 0.5, x = Math.cos(a) * d, z = -5.2 + Math.sin(a) * d; pos.push([x, G(x, z) + 0.01, z]); } instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), pos.map((p, i) => ({ p, s: 1.6, r: [0, i, 0] }))); const F = flames(sc, pos.map((p, i) => ({ p: [p[0] + Math.cos(i) * 0.13, p[1] + 0.08, p[2] - Math.sin(i) * 0.13], h: 0.15, seed: i * 1.7 })), { gain: 1.2 }); const L = [0, 1, 2, 3, 4, 5].map((k) => { const a = k / 6 * 6.283 + 0.4, l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 12, 0, 2); l.position.set(...at(Math.cos(a) * 3.6, -5.2 + Math.sin(a) * 3.6, 0.8)); sc.add(l); return l; }); const A = K.staff(sc, { p: at(0.7, -3.6) }), B = K.staff(sc, { p: at(1.3, -3.3), h: 1.2, seed: 11, wood: 'paleWood' }); K.lean(A, 0.04, 1); K.lean(B, 0.05, 1); const tl = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 30, 0, 2); tl.position.set(...at(-9, -3.6, 1.2)); sc.add(tl);
    return { update(t) { R.hearth.set(t); pos.forEach((_, i) => F.set(i, flick(t, i))); L.forEach((l, i) => { l.intensity = 7 * flick(t, i + 3); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.8, 1.1, 4.6], [0.5, 2.4, 7.4], [0.0, 4.6, 11.0]], look: [[0.6, 1.0, -4], [0.3, 3.0, -5], [0.0, 6.2, -6]], fov: [46, 52], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
