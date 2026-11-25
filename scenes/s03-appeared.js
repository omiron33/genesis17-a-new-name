// On "appeared" light comes down through the oak; its shadows sweep out and the grass bows away.
export const kind = 'three';
import { shot, THREE, rise, g } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { camp, at, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s03-appeared', {
  sky: { hour: 'predawn', az: 150, moonAz: 320, moonEl: 30, extent: 14, center: [0, 3, -3], gust: 0.4, skyK: 1.15, sunK: 1.6 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 60000, r: 12, hearth: { I: 16, smokeCol: [0.25, 0.25, 0.3] }, jars: true, altar: true });
    const st = K.staff(S.scene, { p: at(0.1, 0.6) }); K.lean(st, 0.03, 1);
    const Gy = glory(S.scene, { from: [2.4, 17, 4.5], to: at(0.1, 0.4), angle: 0.26, I: 15000, air: 2.2 });
    return { update(t) { R.hearth.set(t, 1 - 0.45 * rise(t, 17.2, 1.0)); const k = rise(t, 17.15, 0.9) * (1 + 0.18 * g(t, 17.6, 0.3, 0.1, 0.8)); const sw = 1 - rise(t, 17.1, 1.8);
      U.uGust.value = 0.4 + 2.3 * g(t, 17.35, 0.35, 0.3, 1.6); S.sky.light.sky.intensity = S.sky.light.skyI * (1 + 0.5 * k);
      Gy.set(t, k, [2.4 + 7 * sw, 17, 4.5 - 5 * sw], at(0.1, 0.4)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-4.8, 1.0, 8.4], [-3.4, 1.15, 8.2], [-1.6, 1.5, 8.0]], look: [[0.2, 2.4, -2], [0.2, 2.9, -2.4], [0.1, 3.3, -3]], fov: [52, 48], enter: 'moving', exit: 'moving', handheld: 0.2 }),
  post: (t) => ({ exposure: 1.2 }),
});
