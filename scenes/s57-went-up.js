// On "went up" the light lifts off the ground and goes up through the oak into the sky, the shadows racing in after it.
export const kind = 'three';
import { shot, THREE, rise, g, ease } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s57-went-up', {
  sky: { hour: 'golden', az: 150, extent: 14, center: [0, 3, -2], gust: 0.3, el: 8, skyK: 1.0 },
  build(S) {
    const R = camp(S, { at: [0, 2], n: 52000, r: 12, tents: 2, jars: true, hearth: { I: 12 }, altar: true }), sc = S.scene, st = K.staff(sc, { p: at(0.2, 0.8) }); K.lean(st, 0.03, 1); const Gy = glory(sc, { from: [0.4, 20, -8], to: at(0.2, 0.4), angle: 0.15, I: 9000, air: 1.6 });
    const inner = new THREE.PointLight(new THREE.Color(1, 0.84, 0.52), 0, 0, 1.3); sc.add(inner);
    return { update(t) { R.hearth.set(t); const u = Math.max(0, (t - 276.15) / 1.9), up = u < 1 ? u * u * (1.4 - 0.4 * u) : 1; const k = 1.0 * (1 - rise(t, 276.4, 1.7)); const ty = 14 * up; Gy.set(t, Math.max(0, k), [0.4, 20 + 6 * up, -8], [0.2, ty, 0.4 - 4 * up]); inner.position.set(0.3, 1.0 + 11 * up, 0 - 5 * up); inner.intensity = 70 * Math.exp(-Math.pow((up - 0.45) / 0.35, 2)); U.uGust.value = 0.15 + 1.5 * g(t, 276.4, 0.4, 0.4, 1.4); S.sky.u.uRise.value = 1.3 * g(t, 277.0, 0.5, 0.3, 1.6); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-2.8, 0.95, 8.4], [-2.2, 1.0, 8.3], [-1.4, 1.1, 8.2]], look: [[0.1, 2.0, -1], [0.1, 3.6, -2], [0.1, 6.4, -4]], fov: [52, 60], enter: 'moving', exit: 'moving', handheld: 0.12 }),
});
