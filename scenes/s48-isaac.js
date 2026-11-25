// The cradle, and over it a little ring of bells; on "Isaac" the bells laugh and the cradle begins to rock.
export const kind = 'three';
import { shot, THREE, br, g, rise, ring, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { woolMat, sheet, clothMesh } from '/song/lib/cloth.js';
import { rig } from '/kit/motion.js';
export default shot('s48-isaac', {
  sky: { hour: 'golden', az: 96, extent: 8, center: [0, 1, 2.8], gust: 0.4, el: 14 },
  build(S, P) {
    const R = camp(S, { at: [0, 2], n: 36000, r: 10, tents: 2, jars: true, flowers: 360 }), sc = S.scene, y = G(0, 2.8); K.rug(sc, [0, undefined, 2.8], { w: 2.2, d: 1.4, seed: 8, rot: -0.1 }); const C = K.cradle(sc, at(0, 2.8, 0.02), { rot: 0.75, s: 1.75, bedCol: [0.80, 0.46, 0.10], hoop: true });
    const cm = { set() {} };
    const l = new THREE.PointLight(new THREE.Color(1, 0.78, 0.42), 0, 0, 2); l.position.set(0, y + 0.8, 2.8); sc.add(l); C.g.add(new THREE.Group());
    return { update(t) { cm.set(t); C.bells.forEach((b, i) => b.set(1.0 * ring(t, 231.45 + 0.04 * i, 2.5 + 0.2 * (i % 3), 0.8) + 0.06 * Math.sin(t * 2 + i) + 0.16 * ring(t, 230.8 + 0.1 * i, 3.1, 0.6), 1.3 * ring(t, 231.5 + 0.04 * i, 2.5 + 0.2 * (i % 3), 0.65))); C.rock(0.10 * Math.sin((t - 228.4) * 2.6) + 0.26 * ring(t, 231.5, 0.75, 0.3)); l.intensity = 0.8 * rise(t, 228.6, 2.0) + 1.4 * rise(t, 231.4, 0.5); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.4, 1.25, 5.3], [-0.6, 1.2, 5.2], [0.35, 1.2, 4.9]], look: [[0, 0.62, 2.8], [0.02, 0.66, 2.8], [0.04, 0.68, 2.8]], fov: [40, 33], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.005, focus: 2.3 }),
});
