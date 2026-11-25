// The oak small and lit in the blue dark under the Milky Way; the title again.
export const kind = 'three';
import { shot, THREE, rise } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rig } from '/kit/motion.js';
export default shot('s70-end', {
  sky: { hour: 'stars', az: 200, moonAz: 60, moonEl: 36, extent: 18, center: [0, 3, -3], gust: 0.4, skyK: 1.4, sunK: 1.7, envK: 1.5, cover: 0.06, rot: 1.0 },
  build(S) {
    const R = camp(S, { at: [0, 12], n: 60000, r: 13, tents: 4, hearth: { I: 30, smokeCol: [0.16, 0.16, 0.2] }, jars: true, altar: true, spots: [[0, -6, 4.6]], flowers: 200 }), sc = S.scene; const pos = []; for (let i = 0; i < 46; i++) { const a = i / 46 * 6.283, d = 4.4 + 0.6 * Math.sin(i * 1.9), x = Math.cos(a) * d, z = -5.2 + Math.sin(a) * d; pos.push([x, G(x, z) + 0.01, z]); } const F = flames(sc, pos.map((p, i) => ({ p: [p[0], p[1] + 0.08, p[2]], h: 0.18, seed: i * 1.7 })), { gain: 1.3 }); const L = [0, 1, 2, 3, 4, 5].map((k) => { const a = k / 6 * 6.283 + 0.4, l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 16, 0, 2); l.position.set(...at(Math.cos(a) * 3.4, -5.2 + Math.sin(a) * 3.4, 0.9)); sc.add(l); return l; }); const tl = [[-9, -3.6], [9.6, -10.3], [-15.5, -12.8]].map(([x, z]) => { const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 30, 0, 2); l.position.set(...at(x, z, 1.2)); sc.add(l); return l; });
    return { update(t) { R.hearth.set(t); const dim = 1 - 0.75 * rise(t, 346.5, 3.2); pos.forEach((_, i) => F.set(i, flick(t, i) * dim)); L.forEach((l, i) => { l.intensity = 9 * flick(t, i + 3) * dim; }); tl.forEach((l, i) => { l.intensity = 30 * flick(t, i + 8) * dim; }); S.sky.u.uSkyRot.value = 1.0 + (t - 338) * 0.013; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.6, 2.2, 15.0], [0.0, 3.4, 20], [2.6, 5.2, 27]], look: [[0, 7.6, -6], [0.2, 8.8, -6], [0.3, 9.8, -6]], fov: 52, enter: 'moving', exit: 'moving', handheld: 0.08 }),
  finish: (t) => ({ grade: { shadows: [0.012, 0.016, 0.03], highlights: [1.0, 0.97, 0.91], amount: 0.35 }, fade: Math.max(0, (t - 348.6) / 1.3) }),
});
