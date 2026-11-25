// The cord runs out from the staff across the rug to the cradle, winds on its rim and draws tight; light goes along it.
export const kind = 'three';
import { shot, THREE, br, g, rise, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s49-with-him', {
  sky: { hour: 'golden', az: 128, extent: 8, center: [0, 0.8, 2.8], gust: 0.45, el: 13 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 36000, r: 10, tents: 2, jars: true, hearth: true, flowers: 300 }), sc = S.scene, y = G(0, 2.8); K.rug(sc, [0.1, undefined, 2.9], { w: 3.4, d: 1.5, seed: 3 }); const sp = at(-1.3, 2.6), st = K.staff(sc, { p: sp }); K.lean(st, 0.04, 2); const cp = at(0.95, 2.95, 0.02), C = K.cradle(sc, cp, { rot: 0.15, s: 1.3, hoop: true }); const cord = K.coveCord(sc, { n: 420, r: 0.0085, turns: 60 }); const l = new THREE.PointLight(new THREE.Color(1, 0.74, 0.38), 0.3, 0, 2); sc.add(l);
    const rim = (a) => { const c = Math.cos(a), s = Math.sin(a), sq = 1 / Math.pow(Math.pow(Math.abs(c), 2.6) + Math.pow(Math.abs(s), 2.6), 1 / 2.6); const x = c * sq * 0.36 * 1.035 * 1.3, z = s * sq * 0.18 * 1.06 * 1.3, r = 0.15; return [cp[0] + x * Math.cos(r) + z * Math.sin(r), cp[1] + (0.125 + 0.24 + 0.05 * c * c * sq * sq) * 1.3 - 0.015, cp[2] - x * Math.sin(r) + z * Math.cos(r)]; };
    const path = (tight) => (u) => { if (u < 0.10) { const k = u / 0.10, a = k * 6.283 * 2; return [sp[0] + 0.03 + Math.cos(a) * 0.036, sp[1] + 0.62 - 0.05 * k, sp[2] + Math.sin(a) * 0.036]; } if (u < 0.52) { const k = (u - 0.10) / 0.42, e = rim(Math.PI * 0.98), s0 = [sp[0] + 0.066, sp[1] + 0.57, sp[2]]; const sag = (0.62 - 0.50 * tight) * Math.sin(k * Math.PI) ; const x = s0[0] + (e[0] - s0[0]) * k, z = s0[2] + (e[2] - s0[2]) * k + 0.16 * Math.sin(k * 7) * (1 - tight) * Math.sin(k * Math.PI); return [x, (() => { const fl = G(x, z) + 0.045, yy = s0[1] + (e[1] - s0[1]) * k - sag, q = 0.10; return yy > fl + q ? yy : yy < fl - q ? fl : fl + (yy - fl + q) * (yy - fl + q) / (4 * q); })(), z]; } const k = (u - 0.52) / 0.48; return rim(Math.PI * (0.98 + 2.0 * 1.15 * k)); };
    return { update(t) { R.hearth.set(t); const s = 0.12 + 0.88 * ease.inOut3((t - 232.6) / 3.2), tight = ease.inOut3((t - 235.7) / 0.7); cord.set(path(tight), { showA: s, showB: s, k: 1.0 + 0.8 * g(t, 236.0, 0.3, 0.4, 1.4), open: () => 0.008 }); const pulse = Math.min(1, Math.max(0, (t - 235.9) / 1.0)); const q = path(tight)(Math.min(s, 0.1 + 0.9 * pulse)); l.position.set(q[0], q[1] + 0.2, q[2] + 0.15); l.intensity = 0.3 + 1.2 * rise(t, 236.0, 0.9); C.rock(0.06 * Math.sin((t - 235.9) * 4.2) * Math.exp(-Math.max(0, t - 235.9) * 0.8) * (t > 235.9 ? 1 : 0)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.9, 1.15, 5.6], [-0.6, 1.0, 5.6], [0.7, 0.95, 5.2]], look: [[-0.8, 0.55, 2.8], [0.1, 0.5, 2.8], [0.75, 0.52, 2.9]], fov: [40, 36], enter: 'moving', exit: 'moving', handheld: 0.09, aperture: 0.005, focus: 2.5 }),
});
