// The wind drops. The light rests on the staff, unmoving; a single leaf comes down through it.
export const kind = 'three';
import { shot, THREE, rise } from '/song/lib/shot.js';
import { U, M } from '/song/lib/core.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { sprigGeo } from '/song/lib/tree.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s56-finished', {
  sky: { hour: 'golden', az: 128, extent: 9, center: [0, 1.4, 2], gust: 0.5, el: 9, skyK: 1.0 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 46000, r: 11, tents: 2, jars: true, hearth: { I: 8 }, altar: true, flowers: 360 }), sc = S.scene, st = K.staff(sc, { p: at(0, 2.2) }); K.lean(st, 0.03, 1); const y = G(0, 2.2); const Gy = glory(sc, { from: [0.8, 15, -4.2], to: [0, y, 2.2], angle: 0.11, I: 6200, air: 2.4 });
    const lf = K.mesh((() => { const P = [], uv = [], I = [], n = 40; for (let i = 0; i <= n; i++) { const v = i / n, lobe = 0.5 + 0.5 * Math.cos(v * 6.283 * 3.5 + 0.4), w = 0.052 * Math.pow(Math.sin(Math.PI * (0.04 + 0.94 * Math.pow(v, 0.8))), 0.8) * (0.50 + 0.50 * lobe); for (let s = -2; s <= 2; s++) { const x = s / 2; P.push(x * w, v * 0.17 - 0.085, 0.014 * Math.sin(v * 3.2) + 0.016 * x * x - 0.02 * v * v); uv.push(0.5 + 0.5 * x, v); } if (i < n) for (let s = 0; s < 4; s++) { const a = i * 5 + s; I.push(a, a + 1, a + 5, a + 1, a + 6, a + 5); } } const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); gg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); gg.setIndex(I); gg.computeVertexNormals(); return gg; })(), M('leaf', { side: THREE.DoubleSide, transl: 1.2, u: { uColA: [0.30, 0.22, 0.05], uColB: [0.42, 0.30, 0.07] } }), sc);
    return { update(t) { R.hearth.set(t); U.uGust.value = 0.5 * (1 - 0.95 * rise(t, 272.2, 1.2)); Gy.set(t, 1); const d = t - 271.9, sw = Math.sin(d * 2.3), yy = y + 2.35 - 0.50 * d - 0.07 * Math.abs(sw); lf.position.set(0.30 + 0.24 * sw, yy, 2.45 + 0.08 * Math.cos(d * 2.3)); lf.rotation.set(0.9 + 0.5 * Math.cos(d * 2.3), d * 0.9, 0.9 * Math.cos(d * 2.3)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.2, 1.3, 5.3], [-0.6, 1.35, 5.2], [0.0, 1.5, 5.15]], look: [[0.05, 1.35, 2.2], [0.06, 1.3, 2.2], [0.06, 1.3, 2.2]], fov: [40, 38], enter: 'moving', exit: 'moving', handheld: 0.07, aperture: 0.005, focus: 2.9 }),
});
