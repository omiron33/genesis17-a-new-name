// Lamps of the house in red clay and lamps of strangers in pale and blue, two lines meeting, lit from one fire.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { inside, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s32-one-flame', {
  sky: { hour: 'noon', az: 170, extent: 9, center: [0, 1, 0], gust: 0.4, el: 34, envK: 0.45, skyK: 1.0, sunK: 0.7 }, exposure: 1.25,
  build(S) {
    const I = inside(S, { fill: 0.30 }), sc = S.scene, y0 = G(0, 0.2); const blue = K.mat('clay', { side: THREE.DoubleSide, surf: 'float bd = smoothstep(.02, .0, abs(fract(p.y * 26.) - .5) - .22); alb = mix(vec3(.62, .55, .42) * (.8 + .3 * f), vec3(.06, .16, .34) * (.8 + .4 * f), bd); rough = .4;' }, 'blueLamp');
    // a bowl of fire in the middle, two curving lines running to it
    K.jar(sc, [0, y0 + 0.02, 0.2], { kind: 'bowl', s: 1.6, mt: 'bronze' }); const Ff = flames(sc, [{ p: [0, y0 + 0.16, 0.2], h: 0.34, seed: 1 }, { p: [0.08, y0 + 0.16, 0.26], h: 0.22, seed: 4 }, { p: [-0.09, y0 + 0.16, 0.16], h: 0.24, seed: 9 }], { wide: 1, gain: 0.8 }); const l = new THREE.PointLight(new THREE.Color(1, 0.56, 0.22), 7, 0, 2); l.position.set(0, y0 + 0.5, 0.2); l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; l.shadow.normalBias = 0.02; l.shadow.camera.near = 0.1; l.shadow.camera.far = 9; l.shadow.radius = 4; sc.add(l);
    const line = (s) => [...Array(9)].map((_, i) => { const k = (i + 1) / 9, a = 0.35 + 1.0 * k; return [s * (0.35 + 2.3 * k * Math.sin(a) * 1.05), y0 + 0.025, 0.2 + 1.35 * k * Math.cos(a) * (1 + 0.2 * k) + 0.25 * k]; }); const A = line(-1), B = line(1), rot = (p) => Math.atan2(-(0.2 - p[2]), 0 - p[0]); instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), A.map((p) => ({ p, s: 1.5, r: [0, rot(p), 0] }))); instances(sc, K.lampGeo(), blue, B.map((p) => ({ p, s: 1.5, r: [0, rot(p), 0] })));
    const all = [...A, ...B], tip = (p) => { const r = rot(p); return [p[0] + Math.cos(r) * 0.123, p[1] + 0.075, p[2] - Math.sin(r) * 0.123]; }; const F = flames(sc, all.map((p, i) => ({ p: tip(p), h: 0.10, seed: i * 1.3 }))); const pl = [-1, 1].map((s) => { const q = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 0, 0, 2); q.position.set(s * 1.4, y0 + 0.4, 0.9); sc.add(q); return q; });
    return { update(t) { [0, 1, 2].forEach((i) => Ff.set(i, 1)); l.intensity = 8 * flick(t, 5); let s1 = 0, s2 = 0; all.forEach((p, i) => { const b = i >= 9, k = i % 9, T = (b ? 149.75 : 148.0) + k * 0.155, f = Math.max(0, spring(t, T, { freq: 2.6, damping: 0.4 })); F.set(i, f * flick(t, i)); if (b) s2 += f; else s1 += f; }); pl[0].intensity = 0.28 * s1 * flick(t, 1); pl[1].intensity = 0.28 * s2 * flick(t, 2); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.7, 0.75, 2.5], [0.0, 0.85, 2.75], [1.4, 1.0, 2.4]], look: [[-0.2, 0.25, 0.3], [0.0, 0.25, 0.3], [0.1, 0.22, 0.3]], fov: [58, 56], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.004, focus: 2.3 }),
});
