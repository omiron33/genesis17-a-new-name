// A strand of light from one side, a strand of flax from the staff on the other: they reach, miss, and join on "me and you".
export const kind = 'three';
import { shot, THREE, ease, g, rise } from '/song/lib/shot.js';
import { inside, at, G, K } from '/song/lib/sets.js';
import { rig, fractal } from '/kit/motion.js';
export default shot('s24-me-and-you', {
  sky: { hour: 'noon', az: 170, extent: 9, center: [0, 1, 0], gust: 0.4, el: 34, envK: 0.40, skyK: 0.9, sunK: 0.6 }, exposure: 1.15,
  build(S) {
    const I = inside(S, { fill: 0.75 }), sc = S.scene, p = at(-0.95, -0.7); K.staff(sc, { p }); const y = p[1];
    const LM = K.lightMat(1.0), A = K.liveTube(sc, K.flaxMat(), { n: 220, S: 14, r: 0.019 }), B = K.liveTube(sc, LM, { n: 220, S: 14, r: 0.018 }), l = new THREE.PointLight(new THREE.Color(1, 0.75, 0.4), 0.4, 0, 2); sc.add(l); const M = [0.02, y + 1.12, -0.55], foot = [p[0] + 0.03, p[1] + 1.14, p[2] + 0.02];
    return { update(t) { const reach = ease.inOut3((t - 110.8) / 1.5), miss = g(t, 112.3, 0.25, 0.15, 0.7), j = ease.inOut3((t - 113.2) / 0.6), tw = ease.inOut3((t - 113.75) / 0.65), hunt = 1 - j;
      const ga = [M[0] - 0.16 * (1 - reach) - 0.02 + 0.10 * miss, M[1] - 0.13 * hunt - 0.05 * miss + 0.03 * fractal(t * 1.1, { seed: 1 }) * hunt, M[2] + 0.05 * fractal(t, { seed: 4 }) * hunt], gb = [M[0] + 0.30 * (1 - reach) + 0.02 - 0.10 * miss, M[1] + 0.14 * hunt + 0.05 * miss + 0.03 * fractal(t * 1.1, { seed: 7 }) * hunt, M[2] + 0.05 * fractal(t, { seed: 9 }) * hunt];
      const hel = (u, ph) => { const w = Math.exp(-Math.pow((u - 1) / 0.26, 2)) * tw, a = (1 - u) * 24 * tw + ph; return [0, Math.sin(a) * 0.022 * w, Math.cos(a) * 0.022 * w]; }, over = 0.22 * tw;
      A.set((u) => { const h = hel(u, 0), sag = 0.16 * Math.sin(u * Math.PI) * (1 - 0.75 * tw); return [foot[0] + (ga[0] + over - foot[0]) * u, foot[1] + (ga[1] - foot[1]) * u - sag + h[1], foot[2] + (ga[2] - foot[2]) * u + 0.05 * Math.sin(u * 5) * hunt + h[2]]; }, Math.min(1, 0.25 + 0.75 * reach));
      B.set((u) => { const h = hel(u, Math.PI), s0 = [2.6, y + 1.55, -0.9], sag = 0.20 * Math.sin(u * Math.PI) * (1 - 0.75 * tw); return [s0[0] + (gb[0] - over - s0[0]) * u, s0[1] + (gb[1] - s0[1]) * u - sag + h[1], s0[2] + (gb[2] - s0[2]) * u + h[2]]; }, Math.min(1, 0.45 + 0.55 * reach));
      LM.userData.setK(0.9 + 1.0 * g(t, 113.9, 0.2, 0.3, 1.0)); l.position.set(gb[0] + 0.15, M[1] + 0.1, M[2] + 0.35); l.intensity = 1.6 + 2.2 * rise(t, 113.8, 0.6); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.75, 1.25, 1.35], [-0.2, 1.22, 1.05], [0.25, 1.20, 0.65]], look: [[-0.25, 1.05, -0.6], [-0.1, 1.04, -0.6], [0.0, 1.04, -0.6]], fov: [44, 38], enter: 'moving', exit: 'moving', handheld: 0.07, aperture: 0.005, focus: 1.6 }),
});
