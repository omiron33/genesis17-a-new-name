// A strand of flax on the altar; a strand of light comes down beside it, and on "between us" they take one turn.
export const kind = 'three';
import { shot, THREE, rise, ease } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig, fractal } from '/kit/motion.js';
export default shot('s05-between-us', {
  sky: { hour: 'predawn', az: 120, moonAz: 300, moonEl: 36, extent: 4, center: [0, 1, 2], gust: 0.4, skyK: 1.4, sunK: 1.2, envK: 0.9 },
  build(S) {
    const R = bench(S, { bx: 0, bz: 2.2, hearth: { I: 14, smokeCol: [0.25, 0.25, 0.3] }, bseed: 9, tint: 0.42 }); const y = R.top;
    const LM = K.lightMat(1.0), A = K.liveTube(S.scene, K.flaxMat(), { n: 220, r: 0.0105, S: 12 }), B = K.liveTube(S.scene, LM, { n: 220, r: 0.0098, S: 12 });
    const l = new THREE.PointLight(new THREE.Color(1, 0.75, 0.4), 0, 0, 2); S.scene.add(l); K.jar(S.scene, [-0.75, y, 1.95], { s: 0.55, seed: 4 });
    const Gy = glory(S.scene, { from: [0.8, 10, 0.2], to: [0.05, y, 2.25], angle: 0.085, I: 300, air: 1.6 });
    const base = (u) => [(u - 0.5) * 1.3, 0, 2.28 + 0.06 * Math.sin(u * 7 + 0.5)];
    return { update(t) { R.hearth.set(t);
      const come = ease.out3((t - 24.95) / 1.1), tw = ease.inOut3((t - 26.55) / 1.0);
      const wind = (u, ph) => { const w = Math.exp(-Math.pow((u - 0.52) / 0.16, 2)) * tw, a = (u - 0.52) * 62 * tw + ph; return [0, Math.sin(a) * 0.0125 * w + 0.006 + 0.0125 * w, Math.cos(a) * 0.0145 * w]; };
      A.set((u) => { const b = base(u), q = wind(u, 0); return [b[0], y + 0.026 + q[1], b[2] + q[2]]; }, 1, (u) => 0.0105 * Math.min(1, 0.35 + u / 0.05, 0.35 + (1 - u) / 0.05));
      B.set((u) => { const b = base(u), q = wind(u, Math.PI), off = 0.085 * (1 - tw) * 1.0, hi = (1 - come) * (1.25 * Math.sqrt((u - 0.1) * (u - 0.1) + 0.02) + 0.30); return [b[0] + 0.02 * fractal(u * 5 + t * 0.6, { seed: 4 }) * (1 - tw), y + 0.026 + q[1] + hi, b[2] + q[2] - off - 0.02 * Math.sin(u * 9 + 1) * (1 - tw)]; }, Math.min(1, come * 1.05), (u) => 0.0098 * Math.min(1, 0.15 + u / 0.05, 0.15 + (1 - u) / 0.05));
      LM.userData.setK(0.95 + 0.6 * tw); l.position.set(0.05, y + 0.22 + (1 - come) * 0.5, 2.2); l.intensity = 0.35 * come + 0.35 * tw; Gy.set(t, 0.5 + 0.4 * come); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.95, 1.16, 3.25], [0.55, 1.10, 3.2], [0.2, 1.06, 3.05]], look: [[0.05, 0.70, 2.2], [0.05, 0.70, 2.2], [0.05, 0.69, 2.22]], fov: [36, 30], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.008, focus: 1.0 }),
});
