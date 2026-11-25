// From above: many lines of footprints come in by many paths to one tent.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { PRINT_HEAD, PRINT_SURF, walk } from '/song/lib/prints.js';
import { rig } from '/kit/motion.js';
const E = [[-8.2, 0.2], [-7.6, 0.3], [-7.0, 0.3], [-8.8, 0.3], [-6.4, 0.2]]; const ST = [[-2.6, 6.6], [-5.0, 7.4], [-1.2, 3.4], [-8.0, 7.4], [-11.0, 5.6]]; let all = []; ST.forEach((s, i) => { const e = E[[4, 1, 2, 0, 3][i]], m = [(s[0] + e[0]) / 2 + 0.4 * Math.sin(i * 2.1), (s[1] + e[1]) / 2 + 0.2]; all = all.concat(walk([s, m, [e[0], e[1]]], { stride: 0.64, gauge: 0.13, t0: 281.2 + 0.10 * i, dt: 0.275, n: 15, child: i === 3 })); });
export default shot('s59-all-of-them', {
  sky: { hour: 'sunset', az: 100, extent: 11, center: [-6, 1, 3], gust: 0.4, el: 11, skyK: 0.75, sunK: 1.6 },
  build(S) {
    const arr = new Float32Array(76 * 4); all.slice(0, 76).forEach((p, i) => arr.set([p.x, p.z, p.a + (p.child ? 100 * Math.sign(p.a || 1) : 0), 0], i * 4)); const R = camp(S, { at: [-6, 3], n: 46000, r: 10, tents: 1, hearth: { I: 13, shadow: true }, jars: false, rocks: [[-12, 4, 0.4, 6]], oak: { at: [2.5, 0, -8] }, spots: [[-6.5, 2.5, 4.6], [-4, 6, 3.4], [-8.5, 5.5, 3.0]], landU: { uPrints: arr }, landHead: PRINT_HEAD(76, 1.6), surf: PRINT_SURF }), sc = S.scene; K.jar(sc, at(-3.2, 0.6), { s: 1 }); K.jar(sc, at(-2.8, 1.1), { s: 0.8, seed: 2 }); const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 26, 0, 2); l.position.set(...at(-9, -2.6, 1.2)); sc.add(l);
    return { update(t) { R.hearth.set(t); all.slice(0, 76).forEach((p, i) => { arr[i * 4 + 3] = Math.min(1, Math.max(0, (t - p.t) / 0.09)) * 0.85; }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-5.2, 5.0, 9.2], [-5.8, 5.9, 8.4], [-6.6, 6.8, 7.4]], look: [[-6.7, 0.0, 1.7], [-6.9, 0.0, 1.5], [-7.2, 0.0, 1.3]], fov: [50, 50], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
