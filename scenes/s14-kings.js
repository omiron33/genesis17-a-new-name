// On a flat stone a gold circlet spins on its edge, wobbles faster, and rings down flat on "kings".
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
export default shot('s14-kings', {
  sky: { hour: 'morning', az: 200, extent: 3, center: [0, 1, 2.2], gust: 0.5, el: 17 },
  build(S) {
    const R = bench(S, { jars: true, hearth: true, tint: 0.5, bseed: 21, bw: 2.2 }), y = R.top; const rr = 0.16, hh = 0.026;
    for (const [x, z, a, pts] of [[-0.55, 1.95, 0.4, 9], [0.50, 1.90, 1.2, 12], [-0.08, 1.78, 2.2, 7]]) { const c = K.circlet(S.scene, { pts, R: 0.15 + 0.012 * pts / 4 }); c.position.set(x, y + 0.03, z); c.rotation.set((a - 1) * 0.015, a, 0); }
    const c = K.circlet(S.scene, { R: rr }); K.rug(S.scene, [0, y - 0.01, 2.2].map((v) => v), { w: 0.01, d: 0.01 }).visible = false;
    const T0 = 63.6, T1 = 67.05, ph = (t) => -11.5 * Math.pow(Math.max(0, T1 - t), 0.83) * 1.6;
    const ex = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), Y = new THREE.Vector3(0, 1, 0);
    return { update(t) { R.hearth.set(t); const s = Math.max(0, (T1 - t) / (T1 - T0)), al = 1.25 * Math.pow(s, 0.55), f = ph(t); ex.set(Math.cos(f), 0, Math.sin(f)); q1.setFromAxisAngle(ex, al); q2.setFromAxisAngle(Y, -f * (1 - Math.cos(al)) * 0.9 + 0.3); c.quaternion.multiplyQuaternions(q1, q2); const dr = 0.10 * s; c.position.set(0.02 + dr * Math.sin(t * 2.1), y + hh * Math.cos(al) + rr * Math.sin(al) + 0.002, 2.34 + dr * 0.5 * Math.cos(t * 1.7)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.85, 0.98, 3.25], [-0.4, 0.98, 3.2], [0.1, 1.06, 3.1]], look: [[0, 0.78, 2.2], [0, 0.74, 2.2], [0, 0.69, 2.2]], fov: [37, 33], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.006, focus: 1.02 }),
});
