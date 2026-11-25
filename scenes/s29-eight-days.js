// Eight lamps in a row: seven small flames, and on "eight" the eighth takes, taller and brighter than them all.
export const kind = 'three';
import { shot, THREE, ease, g, rise } from '/song/lib/shot.js';
import { inside, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s29-eight-days', {
  sky: { hour: 'noon', az: 170, extent: 9, center: [0, 1, 0], gust: 0.4, el: 34, envK: 0.45, skyK: 1.0, sunK: 0.7 }, exposure: 1.3,
  build(S) {
    const I = inside(S, { fill: 0.32 }), sc = S.scene, y = 0.62; const tb = K.slab(sc, [0, G(0, -0.5) - 0.02, -0.5], { w: 2.3, d: 0.62, h: 0.60, seed: 44, tint: 0.5 }); const cloth = K.rug(sc, [0, 0.578, -0.5], { w: 2.5, d: 0.44, seed: 7, y: 0.0, a: [0.30, 0.04, 0.03], b: [0.10, 0.05, 0.03], c: [0.62, 0.50, 0.30] }); cloth.geometry.attributes.position.needsUpdate = true; { const q = cloth.geometry.attributes.position; for (let i = 0; i < q.count; i++) { const x = q.getX(i); const e = Math.max(0, Math.abs(x) - 1.12); q.setY(i, 0.578 - e * 1.8); } cloth.geometry.computeVertexNormals(); }
    const xs = [...Array(8)].map((_, i) => -0.98 + 0.28 * i), rot = 1.5; const sc2 = (i) => (i === 7 ? 1.45 : 1.05); instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), xs.map((x, i) => ({ p: [x, 0.582, -0.46], s: sc2(i), r: [0, rot, 0] }))); const tip = (i) => [xs[i] + Math.cos(rot) * 0.082 * sc2(i), 0.582 + 0.05 * sc2(i), -0.46 - Math.sin(rot) * 0.082 * sc2(i) + 0.0];
    const tp = (i) => [tip(i)[0], tip(i)[1], -0.46 - Math.sin(rot) * 0.082 * sc2(i)]; const F = flames(sc, xs.map((x, i) => ({ p: tp(i), h: i === 7 ? 0.17 : 0.075, seed: i * 2.1 }))); const l7 = [1, 4].map((i) => { const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 0.7, 0, 2); l.position.set(xs[i] + 0.14, 0.82, -0.36); sc.add(l); return l; }); const l8 = new THREE.PointLight(new THREE.Color(1, 0.74, 0.38), 0, 0, 2); l8.position.set(xs[7], 0.86, -0.40); l8.castShadow = true; l8.shadow.mapSize.set(1024, 1024); l8.shadow.bias = -0.002; l8.shadow.normalBias = 0.02; l8.shadow.camera.near = 0.04; l8.shadow.camera.far = 9; l8.shadow.radius = 4; sc.add(l8);
    return { update(t) { const k = spring(t, 133.62, { freq: 2.2, damping: 0.35 }); xs.forEach((x, i) => F.set(i, i === 7 ? Math.max(0, k) * 1.25 * flick(t, 8) : (0.8 + 0.12 * Math.sin(i)) * flick(t, i) * (1 - 0.12 * g(t, 133.65, 0.15, 0.1, 0.8)))); l7.forEach((l, i) => { l.intensity = 1.7 * flick(t, i); }); l8.intensity = 4.5 * Math.max(0, k) * flick(t, 8); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.8, 0.96, 1.5], [0.0, 0.94, 1.5], [0.7, 0.94, 1.3]], look: [[-0.05, 0.70, -0.5], [0.05, 0.72, -0.5], [0.25, 0.74, -0.5]], fov: [48, 46], enter: 'moving', exit: 'moving', handheld: 0.07, aperture: 0.006, focus: 1.65 }),
});
