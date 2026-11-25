// On "Abraam" the seal rolls over the smooth clay and leaves the new mark behind it, a great tree full of stars.
export const kind = 'three';
import { shot, THREE, rise, ease } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s11-abraam', {
  sky: { hour: 'morning', az: 128, extent: 3, center: [0, 1, 2.2], gust: 0.4, el: 15 },
  build(S) {
    const R = bench(S, { jars: true, hearth: true, tint: 0.4, bseed: 14, oak: { at: [-7, -0.1, -16] } }), y = R.top;
    const B = K.clayBed(S.scene, [0, y, 2.25], { w: 0.92, d: 0.36, h: 0.06, u: { uF: -0.5, uLit: 1, uHold: 0 }, print: `float W = .3267; vec2 q = vec2((cp.x + .46) / W, cp.y / .235 + .5); q.y = 1. - q.y; float done = smoothstep(.0, -.004, cp.x - uF); float k = q.y > 0. && q.y < 1. ? sealNew(q) * done : 0.; h += top * (-.0060 * k); alb *= 1. - .30 * k; float gl = exp((cp.x - uF) * 3.2) * done; emit = vec3(1., .70, .30) * top * k * max(gl * uLit, uHold * done) * 1.7;` });
    const r = 0.052, seal = K.sealMesh(S.scene, { r, h: 0.235, now: 1 }); const l = new THREE.PointLight(new THREE.Color(1, 0.72, 0.36), 0.1, 0, 2); S.scene.add(l);
    const cord = K.liveTube(S.scene, K.flaxMat(), { n: 60, r: 0.006 }); K.jar(S.scene, [-0.78, y, 1.98], { s: 0.5, seed: 7 });
    const Gy = glory(S.scene, { from: [1.2, 9, -0.6], to: [0, y, 2.25], angle: 0.08, I: 330, air: 1.6 });
    return { update(t) { R.hearth.set(t); const k = ease.inOut3((t - 54.45) / 1.45), x = -0.46 + 0.80 * k + 0.012 * Math.sin((t - 53.4) * 7) * (1 - rise(t, 54.3, 0.3)); B.m.userData.u.uF.value = x; B.m.userData.u.uHold.value = 0.75 * rise(t, 55.30, 0.35); seal.g.position.set(x, y + 0.055 + r, 2.25); seal.g.rotation.set(Math.PI / 2, 0, 0); seal.c.rotation.y = -(x + 0.46) / r * 1; seal.g.children[1].rotation.y = seal.c.rotation.y; l.position.set(x - 0.05, y + 0.2, 2.3); l.intensity = 0.12 + 0.22 * rise(t, 55.1, 0.5); seal.m.userData.u.uLit.value = 0.2 + 0.5 * rise(t, 55.0, 0.6);
      cord.set((u) => [x + 0.02 - 0.15 * u * u + 0.5 * u, y + 0.055 + r + 0.45 * u * u + 0.03 * Math.sin(u * 5 + t * 2), 2.25 - 0.125 - 0.25 * u]); Gy.set(t, 0.5 + 0.8 * rise(t, 54.9, 0.7)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.75, 1.12, 3.1], [-0.35, 1.16, 3.0], [0.12, 1.24, 2.95]], look: [[-0.22, 0.68, 2.22], [-0.10, 0.68, 2.22], [0.02, 0.68, 2.22]], fov: [36, 36], enter: 'moving', exit: 'moving', handheld: 0.05, aperture: 0.006, focus: 0.95 }),
});
