// Low along a slow spiral of pale stones, a count of years; the last place in the row is empty.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, K, flames, flick } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export const C = [-0.6, 0, 3.0];
export default shot('s01-tally', {
  sky: { hour: 'predawn', az: 150, moonAz: 320, moonEl: 30, extent: 6, center: [-0.6, 0.5, 3], gust: 0.5, skyK: 1.3, sunK: 2.4, envK: 1.2 },
  build(S) {
    const R = camp(S, { at: [-0.6, 3.5], n: 26000, r: 8, tents: 2, hearth: { I: 20, shadow: false, smokeCol: [0.2, 0.2, 0.26] }, jars: true, spots: [[-0.6, 3.0, 2.6]] });
    const LAST = [...Array(13)].map((_, i) => 85 + i); K.tally(S.scene, C, { skip: [...LAST, 98] }); const spots = K.tallySpots(C), peb = LAST.map((q, i) => { const m = K.mesh(K.pebbleGeo(i), K.mat('paleStone', { uvless: true }), S.scene); m.scale.setScalar(0.042 + 0.010 * ((i * 0.618) % 1)); return { m, e: spots[q], t0: 6.15 + 0.43 * i, s: 0.046 }; });
    const st = K.staff(S.scene, { p: at(0.95, 1.6) }); K.lean(st, 0.05, 1);
    
    return { update(t) { R.hearth.set(t); peb.forEach((q) => { const d = t - q.t0, k = Math.min(1, Math.max(0, d / 0.62)), off = 0.75 * (1 - k) * (1 - k), a = q.e[3] + 1.35, x = q.e[0] + Math.cos(a) * off, z = q.e[2] + Math.sin(a) * off, rk = d > 0.62 ? 0.28 * Math.sin((d - 0.62) * 15) * Math.exp(-(d - 0.62) * 4) : 0; q.m.visible = d > 0; q.m.position.set(x, q.e[1] + q.s * 0.5 + 0.01 * Math.abs(Math.sin(off * 20)), z); q.m.rotation.set(0, -a, off / 0.04 + rk); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.9, 0.55, 4.5], [-0.7, 0.48, 4.75], [0.5, 0.50, 4.55], [1.15, 0.55, 4.1]], look: [[-0.7, 0.05, 3.0], [-0.5, 0.05, 2.9], [-0.1, 0.06, 2.8], [0.15, 0.08, 2.7]], fov: 40, enter: 'moving', exit: 'moving', handheld: 0.15, aperture: 0.006, focus: 1.7 }),
});
