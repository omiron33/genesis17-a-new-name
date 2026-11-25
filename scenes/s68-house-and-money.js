// Lamps of every make going down the hill path from the tents, the same flame in each.
export const kind = 'three';
import { shot, THREE, rise } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s68-house-and-money', {
  sky: { hour: 'dusk', az: 205, moonAz: 40, moonEl: 32, extent: 10, center: [1.5, 1, 5], gust: 0.35, skyK: 1.3, sunK: 2.0, envK: 1.1, rot: 0.7 },
  build(S) {
    const R = camp(S, { at: [1.5, 5], n: 52000, r: 11, tents: 3, hearth: { I: 20, smokeCol: [0.2, 0.18, 0.22] }, jars: true, paths: [[0, 0, 1.2, 4.5, 1.3], [1.2, 4.5, 3.2, 9.5, 1.3]] }), sc = S.scene, r = rng(7); const blue = K.mat('clay', { side: THREE.DoubleSide, surf: 'float bd = smoothstep(.02, .0, abs(fract(p.y * 26.) - .5) - .22); alb = mix(vec3(.62, .55, .42) * (.8 + .3 * f), vec3(.06, .16, .34) * (.8 + .4 * f), bd); rough = .4;' }, 'blueLamp'); const tl = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 34, 0, 2); tl.position.set(...at(-9, -3.6, 1.2)); sc.add(tl);
    const pos = []; for (let i = 0; i < 34; i++) { const u = i / 33, z = 9.2 - 11.5 * u, cx = 0.2 + 0.36 * Math.max(0, z) - 0.02 * z * z * 0.2, side = i % 2 ? 1 : -1; const x = cx + side * (0.62 + 0.2 * r()); pos.push([x, G(x, z) + 0.01, z, r()]); } const kind = (k) => pos.map((p, i) => [p, i]).filter(([, i]) => i % 3 === k); [K.mat('clay', { side: THREE.DoubleSide }), blue, K.mat('bronze', { side: THREE.DoubleSide, uvless: true }, 'brLamp')].forEach((m, k) => instances(sc, K.lampGeo(), m, kind(k).map(([p]) => ({ p: [p[0], p[1], p[2]], s: 1.5, r: [0, p[3] * 6, 0] })))); const F = flames(sc, pos.map((p, i) => { const a = p[3] * 6; return { p: [p[0] + Math.cos(a) * 0.123, p[1] + 0.075, p[2] - Math.sin(a) * 0.123], h: 0.11, seed: i * 1.7 }; })); const L = [2, 7, 13, 20, 28].map((i) => { const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 0, 0, 2); l.position.set(pos[i][0], pos[i][1] + 0.4, pos[i][2]); sc.add(l); return [l, i]; });
    return { update(t) { R.hearth.set(t); tl.intensity = 34 * flick(t, 9); const T = (i) => 326.1 + (33 - i) * 0.095; pos.forEach((p, i) => F.set(i, Math.max(0, spring(t, T(i), { freq: 2.4, damping: 0.4 })) * flick(t, i))); L.forEach(([l, i]) => { l.intensity = 3.0 * rise(t, T(i), 0.6) * flick(t, i); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[4.6, 0.75, 11.2], [4.2, 1.0, 11.4], [3.4, 1.6, 11.6]], look: [[1.6, 0.6, 4], [1.5, 0.7, 3.5], [1.2, 0.9, 2.5]], fov: [44, 46], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.003, focus: 4 }),
});
