// Thirteen small stones in a line by the short staff; on "thirteen" the last one drops in.
export const kind = 'three';
import { shot, THREE, ring, br } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { ismael } from '/song/lib/cast.js';
import { rig } from '/kit/motion.js';
export default shot('s64-thirteen', {
  sky: { hour: 'dusk', az: 215, moonAz: 60, moonEl: 34, extent: 8, center: [0, 0.6, 3], gust: 0.35, skyK: 1.5, sunK: 2.6, envK: 1.3 },
  build(S, P) {
    const R = camp(S, { at: [0, 1], n: 26000, r: 9, tents: 2, far: 320, hearth: { I: 24, smokeCol: [0.2, 0.18, 0.22] }, jars: true, spots: [[0, 3, 2.4]] }), sc = S.scene; const spot = (i) => { const u = i / 12 - 0.5, x = u * 1.75, z = 3.2 - 0.35 * Math.cos(u * 2.6) + 0.35; return [x, G(x, z), z]; }; const s = 0.052; instances(sc, K.pebbleGeo(0), K.mat('paleStone', { uvless: true }), [...Array(12)].map((_, i) => { const p = spot(i); return { p: [p[0], p[1] + s * 0.45, p[2]], s: s * (0.9 + 0.25 * ((i * 0.618) % 1)), r: [0.2, i * 1.7, 0.1] }; })); const E = spot(12), last = K.mesh(K.pebbleGeo(1), K.mat('paleStone', { uvless: true }), sc); last.scale.setScalar(s);
    const I = ismael(S, P, { x: 1.25, z: 2.75, h: 1.15, dir: -1, wind: (t) => [-1.8 * br(t), 0.2, 0.5 * br(t + 3)] });
    const lb = K.lampBody(sc, at(0.1, 2.75), { s: 1.4, rot: -1.2 }), F = flames(sc, [{ p: lb.tip(), h: 0.11 }]), l = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 1.6, 0, 2), q = lb.tip(); l.position.set(q[0], q[1] + 0.10, q[2]); l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; l.shadow.normalBias = 0.01; l.shadow.camera.near = 0.03; l.shadow.camera.far = 8; l.shadow.radius = 4; sc.add(l);
    return { update(t) { R.hearth.set(t); I.set(t); F.set(0, flick(t, 1)); l.intensity = 2.0 * flick(t, 1); const T = 306.5, d = t - T, k = Math.min(1, Math.max(0, (t - T + 1.15) / 1.15)), off = 1 - Math.pow(k, 0.8) * (2 - Math.pow(k, 0.8)) * 1.0, o2 = Math.max(0, off); const x = E[0] + 0.95 * o2, z = E[2] + 0.45 * Math.sin(o2 * 2.4) * o2; const rk = d > 0 ? 0.34 * ring(t, T, 2.3, 2.6) : 0; last.visible = k > 0; last.position.set(x, G(x, z) + s * 0.5 + 0.012 * Math.abs(Math.sin(o2 * 16)) * (1 - k), z); last.rotation.set(0.2, 0.6, o2 * 15 + rk); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.9, 0.72, 5.6], [-0.1, 0.70, 5.6], [0.6, 0.74, 5.4]], look: [[0.05, 0.36, 3.1], [0.1, 0.36, 3.1], [0.15, 0.36, 3.1]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.005, focus: 2.1 }),
});
