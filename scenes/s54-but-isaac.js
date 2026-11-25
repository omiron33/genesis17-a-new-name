// The cradle again, alone in the last sun, the cord bound on its rim alight; the camera comes close.
export const kind = 'three';
import { shot, THREE, br, g, rise } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s54-but-isaac', {
  sky: { hour: 'golden', az: 150, extent: 8, center: [0, 0.8, 2.8], gust: 0.4, el: 9, skyK: 1.0 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 40000, r: 10, tents: 2, jars: true, hearth: { I: 10 }, flowers: 360 }), sc = S.scene, cp = at(0, 2.9, 0.02), C = K.cradle(sc, cp, { rot: 0.95, s: 1.4, hoop: true }); const cord = K.coveCord(C.body, { n: 260, r: 0.0085, turns: 40 }); const rim = (a) => { const c = Math.cos(a), s = Math.sin(a), sq = 1 / Math.pow(Math.pow(Math.abs(c), 2.6) + Math.pow(Math.abs(s), 2.6), 1 / 2.6); return [c * sq * 0.36 * 1.035, 0.125 + 0.22 + 0.05 * c * c * sq * sq, s * sq * 0.18 * 1.06]; }; const l = new THREE.PointLight(new THREE.Color(1, 0.78, 0.44), 1, 0, 2); l.position.set(cp[0], cp[1] + 0.85, cp[2]); sc.add(l);
    return { update(t) { R.hearth.set(t); const k = 1.0 + 1.2 * g(t, 263.95, 0.4, 0.5, 1.5); cord.set((u) => { const q = rim(u * 6.283 * 2.02 - 0.5); return [q[0], q[1] - 0.026 * Math.floor(u * 2.02) * 0 - 0.024 * u * 2, q[2]]; }, { k, open: () => 0.0075 }); l.intensity = 0.8 + 1.2 * rise(t, 263.6, 0.8); C.rock(0.17 * Math.sin((t - 261) * 4.2) * Math.exp(-(t - 261) * 0.65)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.6, 0.95, 5.4], [1.0, 0.95, 5.0], [0.4, 1.05, 4.5]], look: [[0, 0.5, 2.9], [0, 0.5, 2.9], [0, 0.5, 2.9]], fov: [38, 32], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.006, focus: 1.9 }),
});
