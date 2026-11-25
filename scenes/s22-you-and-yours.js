// Three staffs, a man's, a youth's and a boy's, set one after another into the ground, each with its own weight.
export const kind = 'three';
import { shot, THREE, ring } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { puff } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s22-you-and-yours', {
  sky: { hour: 'noon', az: 70, extent: 8, center: [0, 1, 3], gust: 0.5, el: 38 },
  build(S) {
    const R = camp(S, { at: [0, 3], n: 46000, r: 10, hearth: true, jars: true, altar: true, spots: [[0, 3, 3]] }), sc = S.scene;
    const D = [[-0.85, 2.9, 1.75, 2, true, 102.45, 0.9], [0.15, 2.7, 1.36, 7, true, 103.25, 0.75], [0.95, 2.95, 0.98, 11, true, 104.55, 0.6], [1.60, 2.7, 0.70, 15, true, 105.2, 0.5]];
    const s = D.map(([x, z, h, sd, hk, t0, w]) => { const m = K.staff(sc, { p: at(x, z), h, seed: sd, hook: hk, wood: sd % 2 ? 'paleWood' : 'wood' }); const p = puff(sc, { at: at(x, z), t0: t0 + 0.02, n: 24, size: 0.14 * w, spread: 0.45 * w, a: 0.14 }); const clod = [...Array(7)].map((_, i) => { const r = 0.02 + 0.02 * ((i * 0.618) % 1); return K.mesh(K.pebbleGeo(i), K.mat('plain', { uvless: true, surf: 'alb = vec3(.20, .12, .07) * (.7 + .5 * fb(p * 3.));' }, 'soilbit'), sc); }); return { m, p, clod, x, z, h, t0, w }; });
    return { update(t) { R.hearth.set(t); s.forEach((q) => { const d = q.t0 - t; const y = d > 0 ? 0.5 * Math.min(1, 1 - Math.pow(1 - Math.min(1, d / 0.34), 2)) * 1 + (d > 0.34 ? 0.05 * Math.sin(t * 3) : 0) : -0.07 - 0.01 * ring(t, q.t0, 5, 8); q.m.position.y = G(q.x, q.z) + y; K.lean(q.m, 0.03 + 0.05 * q.w * ring(t, q.t0, 3.2 / Math.sqrt(q.h), 2.4) , q.x * 3); q.m.visible = t > q.t0 - 0.75; if (d > 0.34 && d < 0.9) q.m.position.y += 1.6 * Math.pow((d - 0.34) / 0.56, 2); q.p.set(t);
      q.clod.forEach((c, i) => { const a = i / 7 * 6.28, e = Math.max(0, t - q.t0), v = 0.5 + 0.4 * ((i * 0.37) % 1), tf = Math.min(e, 0.36), rr = 0.04 + tf * v * 0.9; c.position.set(q.x + Math.cos(a) * rr, G(q.x, q.z) + 0.01 + Math.max(0, (1.7 * tf - 4.9 * tf * tf) * 0.8 * q.w), q.z + Math.sin(a) * rr); c.scale.setScalar(0.020 + 0.018 * ((i * 0.618) % 1)); c.rotation.set(tf * 9 + i, i, 0); c.visible = e > 0; }); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-2.6, 0.75, 5.7], [-0.8, 0.70, 6.0], [1.4, 0.80, 5.8]], look: [[-0.4, 0.85, 2.8], [0.2, 0.75, 2.8], [0.55, 0.70, 2.8]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.004, focus: 3.0 }),
});
