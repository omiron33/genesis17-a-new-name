// Before dawn: up through the grass to the oak of Mambre under the stars, a hearth alive by the tents.
export const kind = 'three';
import { shot, THREE, br } from '/song/lib/shot.js';
import { camp, at, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s00-title', {
  sky: { hour: 'stars', az: 20, moonAz: 300, moonEl: 26, extent: 17, center: [-1, 2.5, -3], gust: 0.55, skyK: 1.5, sunK: 2.0, envK: 1.6, cover: 0.2, seed: 2.2 },
  build(S) {
    const R = camp(S, { at: [-1, 4], n: 70000, r: 13, hearth: { I: 26, shadow: true, gain: 1.1, smokeCol: [0.16, 0.17, 0.22] }, jars: true, tents: 3, tall: 1.2 });
    const st = K.staff(S.scene, { p: at(-3.0, 0.7) }); K.lean(st, 0.06, 2.4);
    const lamp = new THREE.PointLight(new THREE.Color(1, 0.55, 0.22), 14, 0, 2); lamp.position.set(...at(-9, -4, 1.2)); S.scene.add(lamp);
    return { update(t) { R.hearth.set(t); lamp.intensity = 14 * (1 + 0.05 * Math.sin(t * 9) * Math.sin(t * 5.3)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[3.6, 0.28, 13.2], [2.2, 1.0, 11.4], [0.6, 2.1, 9.6]], look: [[-0.4, 2.2, 0], [-0.6, 4.4, -2], [-0.8, 6.0, -5]], fov: 54, enter: 'moving', exit: 'moving', handheld: 0.2 }),
  post: { vignette: 0.15 },
});
