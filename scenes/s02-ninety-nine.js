// On "ninety-nine" the last stone rolls in, rocks and settles in its place at the foot of the staff.
export const kind = 'three';
import { shot, THREE, ring, ease } from '/song/lib/shot.js';
import { camp, at, G, K, flick } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s02-ninety-nine', {
  sky: { hour: 'predawn', az: 150, moonAz: 320, moonEl: 30, extent: 4, center: [0.5, 0.5, 2.4], gust: 0.5, skyK: 1.3, sunK: 2.6, envK: 1.25 },
  build(S) {
    const R = camp(S, { at: [-0.6, 3.0], n: 24000, r: 8, tents: 2, hearth: { I: 22, smokeCol: [0.2, 0.2, 0.26] }, jars: true, spots: [[-0.6, 3.0, 2.6]] });
    const C = [-0.6, 0, 3.0]; K.tally(S.scene, C, { skip: [98] }); const spots = K.tallySpots(C), E = spots[98];
    const st = K.staff(S.scene, { p: at(E[0] + 0.20, E[2] - 0.22) }); K.lean(st, 0.04, 0.4);
    const s = 0.05, peb = K.mesh(K.pebbleGeo(1), K.mat('paleStone', { uvless: true }), S.scene); peb.scale.setScalar(s);
    const a0 = E[3] + Math.PI * 0.5, dir = [Math.cos(a0), Math.sin(a0)];
    return { update(t) { R.hearth.set(t);
      const T0 = 12.55, T1 = 13.55, k = Math.min(1, Math.max(0, (t - T0) / (T1 - T0))), d = 0.95 * (1 - k) * (1 - k), x = E[0] + dir[0] * d, z = E[2] + dir[1] * d; const roll = d / (s * 0.8) + 0.30 * ring(t, T1, 2.4, 3.2);
      peb.position.set(x, G(x, z) + s * 0.62 + 0.006 * Math.abs(Math.sin(roll * 1.5)) * (1 - k), z); peb.quaternion.setFromAxisAngle(new THREE.Vector3(dir[1], 0, -dir[0]), roll); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.55, 0.30, 4.75], [0.85, 0.28, 4.45], [1.0, 0.36, 4.1]], look: [[-0.1, 0.12, 2.2], [0.0, 0.16, 2.2], [0.1, 0.22, 2.2]], fov: [40, 37], enter: 'moving', exit: 'moving', handheld: 0.12, aperture: 0.005, focus: 2.0 }),
});
