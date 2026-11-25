// A row of lamps in the dusk of the tent: one gutters, shrinks, and goes out; its smoke goes up.
export const kind = 'three';
import { shot, THREE, ease, g } from '/song/lib/shot.js';
import { inside, at, G, K, flames, flick, smoke } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rig, fractal } from '/kit/motion.js';
export default shot('s35-cut-off', {
  sky: { hour: 'afternoon', az: 170, extent: 9, center: [0, 1, 0], gust: 0.4, el: 20, envK: 0.34, skyK: 0.8, sunK: 0.4 }, exposure: 1.3,
  build(S) {
    const I = inside(S, { fill: 0.20 }), sc = S.scene; K.slab(sc, [0, G(0, -0.4) - 0.02, -0.4], { w: 2.3, d: 0.62, h: 0.60, seed: 45, tint: 0.5 }); const xs = [...Array(7)].map((_, i) => -0.96 + 0.32 * i), X = 4, rot = 1.5, s = 1.25; instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), xs.map((x, i) => ({ p: [x, 0.575 + 0.004 * Math.sin(i * 3), -0.36], s, r: [0, rot + 0.15 * Math.sin(i * 2.4), 0] }))); const tip = (x, i) => { const r = rot + 0.15 * Math.sin(i * 2.4); return [x + Math.cos(r) * 0.082 * s, 0.575 + 0.05 * s, -0.36 - Math.sin(r) * 0.082 * s]; };
    const F = flames(sc, xs.map((x, i) => ({ p: tip(x, i), h: 0.10, seed: i * 2.1 }))); const L = [0.5, 2.5, 4, 5.5].map((q) => { const l = new THREE.PointLight(new THREE.Color(1, 0.58, 0.24), 1.6, 0, 2); l.position.set(-0.96 + 0.32 * q, 0.86, -0.26); sc.add(l); return l; }); L[2].castShadow = true; Object.assign(L[2].shadow, { bias: -0.002, normalBias: 0.02, radius: 4 }); L[2].shadow.camera.near = 0.05; L[2].shadow.camera.far = 8; L[2].shadow.mapSize.set(1024, 1024);
    const tp = tip(xs[X], X); const sm = smoke(sc, { at: () => [tp[0], tp[1] + 0.01, tp[2]], n: 60, life: 3.4, size: [0.010, 0.10], a: 0.26, rise: 0.30, color: [0.42, 0.42, 0.46], wind: (t) => [0.03 * fractal(t * 0.8, { seed: 2 }), 0, 0.02 * fractal(t, { seed: 6 })], on: (b) => (b > 168.15 ? 1 : 0) * Math.max(0, 1 - (b - 168.2) / 3.6) });
    const em = K.mesh(new THREE.SphereGeometry(0.005, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.7, 0.15) }), sc, tp);
    return { update(t) { const gut = t < 166.4 ? 1 : t < 168.2 ? Math.max(0.06, (1 - 0.62 * ease.inOut3((t - 166.4) / 1.7)) * (0.65 + 0.5 * fractal(t * 9, { seed: 3, octaves: 2 }) + 0.15)) : 0.5 * Math.exp(-(t - 168.2) * 9) ; xs.forEach((x, i) => { const lean = Math.exp(-Math.pow((i - X) / 1.6, 2)) * g(t, 168.3, 0.4, 0.8, 2.0); F.set(i, i === X ? (gut < 0.01 ? 0 : gut) : flick(t, i) * (0.95 - 0.18 * lean)); }); L.forEach((l, i) => { l.intensity = i === 2 ? 2.2 * Math.max(0, gut) : 1.5 * flick(t, i); }); sm.set(t); em.material.color.setRGB(3 * Math.max(0.0, 1 - Math.max(0, t - 168.3) / 2.2) * (t > 168 ? 1 : 0.0), 0.5 * Math.max(0, 1 - Math.max(0, t - 168.3) / 2.2), 0.08); em.visible = t > 168.1 && t < 170.2; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.8, 0.92, 1.35], [0.0, 0.94, 1.1], [0.42, 0.95, 0.62]], look: [[0.0, 0.74, -0.4], [0.2, 0.76, -0.4], [0.32, 0.80, -0.4]], fov: [44, 40], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.005, focus: 1.4 }),
});
