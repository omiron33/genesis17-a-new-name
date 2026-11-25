// On "facedown" the staff falls full length to the earth, knocks, and lies still; light comes over it.
export const kind = 'three';
import { shot, THREE, rise, g } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { camp, at, G, K, falls } from '/song/lib/sets.js';
import { glory, puff } from '/song/lib/fire.js';
import { rig, anticipate } from '/kit/motion.js';
export default shot('s07-facedown', {
  sky: { hour: 'sunrise', az: 72, extent: 8, center: [0, 1, 2], gust: 0.5, el: 8 },
  build(S) {
    const R = camp(S, { at: [0, 3], n: 46000, r: 10, hearth: true, jars: true, altar: true, spots: [[0, 2.2, 3.4]] });
    const st = K.staff(S.scene, { p: at(-1.1, 2.4) }); const d = puff(S.scene, { at: (h) => at(-1.1 + 1.75 * h, 2.4 + 0.1 * h), t0: 33.25, size: 0.26, spread: 0.7, a: 0.12 });
    const Gy = glory(S.scene, { from: [2.5, 13, -5], to: at(-0.2, 2.4), angle: 0.14, I: 5200, air: 1.6 });
    return { update(t) { R.hearth.set(t); const a = -0.07 * g(t, 31.75, 0.4, 0.02, 0.12) + falls(t, 32.2, 1.05); K.lean(st, 0.02 + a * 0.985, Math.PI / 2 + 0.10); st.position.y = G(-1.1, 2.4) + 0.028 * Math.min(1, a / 1.4); d.set(t);
      const k = 0.18 + 1.0 * rise(t, 33.6, 1.6); U.uGust.value = 0.5 + 0.9 * g(t, 34.8, 0.5, 0.4, 1.6); const x = 1.2 - 1.4 * rise(t, 34.0, 3.2); Gy.set(t, k, [2.5 + x, 13, -5], at(-0.2 + x * 0.6, 2.4)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[1.0, 0.95, 5.9], [0.6, 0.75, 5.5], [0.1, 0.62, 5.0], [-0.5, 0.60, 4.5]], look: [[-0.5, 0.85, 2.2], [-0.4, 0.6, 2.2], [-0.25, 0.10, 2.2], [-0.2, -0.02, 2.2]], fov: [42, 36], enter: 'moving', exit: 'moving', handheld: 0.12, aperture: 0.004, focus: 2.9 }),
});
