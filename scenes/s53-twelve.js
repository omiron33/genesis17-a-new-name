// Evening on the plain: twelve fires are lit, one after another, each with its tents.
export const kind = 'three';
import { shot, THREE, br } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick, smoke } from '/song/lib/sets.js';
import { sheet, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { ismael } from '/song/lib/cast.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s53-twelve', {
  sky: { hour: 'sunset', az: 18, moonAz: 100, extent: 22, center: [2, 1, 22], gust: 0.5, el: 2.5, skyK: 1.5, hor: [0.72, 0.40, 0.30] }, exposure: 0.92,
  build(S, P) {
    const R = camp(S, { at: [0, 13], n: 46000, r: 12, tents: 0, oak: false, flowers: 120, far: 520, dry: 0.2, spots: [[2, 26, 12]] }), sc = S.scene;
    const I = ismael(S, P, { x: -4.3, z: 11.5, h: 1.6, wind: (t) => [2.2 * br(t), 0.3, 0.6 * br(t + 3)] });
    const src = sheet({ w: 4.2, h: 3.8, nx: 22, ny: 16, t0: 0, iter: 10, damp: 0.97, rest: (u, v) => [(u - 0.5) * 3.6, 1.9 - Math.abs(v - 0.5) * 3, (v - 0.5) * 2.8], pin: (a, b) => ((b === 0 || b === 15) && a % 7 === 0 ? () => [(a / 21 - 0.5) * 3.6, 0.02, (b / 15 - 0.5) * 3.1] : b === 8 && (a === 3 || a === 18) ? () => [(a / 21 - 0.5) * 3.6, 1.95, 0] : null), wind: () => [0, 0, 0] }); const tmp = new THREE.Group(), sm = clothMesh(tmp, src, K.mat('hair', { side: THREE.DoubleSide, u: { uStrips: 8 }, surf: 'alb = mix(alb, vec3(.26, .20, .15) * (.8 + .4 * f), .7);' }, 'nt0'), { sub: 1 }); sm.set(1.5);
    const D = [[-7.0, 18], [1.2, 17], [9.0, 18.5], [-13, 26], [-3.6, 25], [6.0, 26.5], [15.5, 26], [-9, 36], [2.0, 35.5], [12.5, 37], [-20, 38], [22, 38]]; const T = [...Array(12)].map((_, i) => 254.6 + 0.36 * i + (i > 3 ? 0.1 : 0)); const list = []; D.forEach(([x, z], i) => { for (let k = 0; k < 2; k++) list.push([x + (k ? 2.9 : -2.9), z + 2.6 + 0.5 * k, k ? -0.35 : 0.35]); }); const im = new THREE.InstancedMesh(sm.mesh.geometry, sm.mesh.material, list.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(); list.forEach(([x, z, a], i) => { q.setFromEuler(new THREE.Euler(0, a, 0)); m.compose(new THREE.Vector3(x, G(x, z) - 0.05, z), q, new THREE.Vector3(1.05, 1.05, 1.05)); im.setMatrixAt(i, m); }); im.castShadow = im.receiveShadow = true; im.frustumCulled = false; sc.add(im);
    const F = flames(sc, D.flatMap(([x, z], i) => [0, 1].map((k) => ({ p: [x + k * 0.25, G(x, z) + 0.08, z + k * 0.1], h: (1.25 - 0.4 * k), seed: i * 3.1 + k * 7 }))), { wide: 1, gain: 0.55 }); const L = D.map(([x, z]) => { const l = new THREE.PointLight(new THREE.Color(1, 0.46, 0.15), 0, 0, 2); l.position.set(x, G(x, z) + 1.3, z); sc.add(l); return l; }); const sk = [0, 1, 2, 4].map((i) => smoke(sc, { at: () => [D[i][0], G(...D[i]) + 1.1, D[i][1]], size: [0.15, 1.3], rise: 1.1, life: 6, n: 26, a: 0.06, color: [0.40, 0.33, 0.34], wind: (t) => [0.6 * br(t), 0, 0.1], on: (b) => (b > T[i] ? 1 : 0) }));
    return { update(t) { I.set(t); D.forEach((_, i) => { const k = Math.max(0, spring(t, T[i], { freq: 1.6, damping: 0.4 })); F.set(i * 2, k); F.set(i * 2 + 1, k); L[i].intensity = 34 * k * flick(t, i + 2); }); sk.forEach((s) => s.set(t)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-3.2, 2.0, 6.6], [-1.6, 5.0, 4.4], [0.8, 10.5, 0.0]], look: [[-0.4, 1.2, 18], [0.4, 0.8, 22], [1.0, 0.2, 25]], fov: [46, 46], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
