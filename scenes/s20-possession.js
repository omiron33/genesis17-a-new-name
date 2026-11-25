// A boundary cairn: stone after stone comes down on the beat; on "their God" the light comes over it.
export const kind = 'three';
import { shot, THREE, rise, ease, g, ring } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { puff, glory } from '/song/lib/fire.js';
import { U } from '/song/lib/core.js';
import { rng } from '/song/lib/noise.js';
import { rockGeo, instances } from '/song/lib/land.js';
import { rig, weight, move } from '/kit/motion.js';
export default shot('s20-possession', {
  sky: { hour: 'morning', az: 72, extent: 9, center: [0.5, 1.5, 7], gust: 0.6, el: 20 },
  build(S) {
    const X = 0.6, Z = 7.2, R = camp(S, { at: [0.5, 8.5], n: 52000, r: 11, tents: 1, oak: true, flowers: 420, spots: [[X, Z, 1.6]], paths: [[0, 2, X, Z, 1]], rocks: [[-2.6, 8.2, 0.3, 7], [3.6, 6.4, 0.4, 8], [2.2, 9.6, 0.25, 6]] }), sc = S.scene;
    const r = rng(8), D = []; const put = (x, y, z, s, t0, from) => D.push({ x, y, z, s, t0, from, rx: r() * 6, ry: r() * 6, k: D.length % 3 }); const beats = [90.75, 91.12, 91.48, 91.85, 92.21, 92.58, 92.94, 93.31, 93.67, 94.04, 94.4, 94.77, 95.72];
    for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; put(Math.cos(a) * 0.50, 0.16, Math.sin(a) * 0.50, 0.30, beats[i], a); } for (let i = 0; i < 4; i++) { const a = i / 4 * 6.283 + 0.5; put(Math.cos(a) * 0.32, 0.46, Math.sin(a) * 0.32, 0.26, beats[6 + i], a); } put(0.12, 0.74, 0.05, 0.22, beats[10], 1); put(-0.14, 0.72, -0.04, 0.20, beats[11], 4); put(0.0, 0.98, 0.0, 0.19, beats[12], 2.2);
    const geos = [0, 1, 2].map((i) => rockGeo(77 + i * 5, 4, 0.8)), y0 = G(X, Z), ms = D.map((d) => { const m = K.mesh(geos[d.k], K.mat('limestone', { uvless: true, surf: 'alb *= .60;' }, 'cairn'), sc); m.scale.set(d.s * 1.1, d.s, d.s); return m; }); const puffs = D.map((d, i) => puff(sc, { at: [X + d.x, y0 + d.y - d.s * 0.4, Z + d.z], t0: d.t0, n: 22, size: 0.18, spread: 0.6, a: 0.20, life: 1.5, seed: i }));
    const st = K.staff(sc, { p: at(X - 1.5, Z - 0.5) }); K.lean(st, 0.05, 2); const Gy = glory(sc, { from: [X + 2.0, 15, Z + 3.0], to: [X, y0 + 0.4, Z], angle: 0.11, I: 1500, air: 3.4 });
    return { update(t) { D.forEach((d, i) => { const e = t - d.t0, m = ms[i]; m.visible = e > -0.42; const q = Math.min(1, Math.max(0, -e / 0.42)), b = e > 0 ? 0.05 * Math.abs(Math.sin(e * 13)) * Math.exp(-e * 7) : 0; m.position.set(X + d.x + Math.cos(d.from) * 0.75 * q, y0 + d.y + 0.85 * (q * q) + 0.35 * Math.sin(q * 3.14) * q + b, Z + d.z + Math.sin(d.from) * 0.75 * q); const rk = e > 0 ? 0.20 * Math.sin(e * 15) * Math.exp(-e * 4) : 1.6 * q; m.rotation.set(d.rx + rk, d.ry, 0.2 + rk); puffs[i].set(t); }); U.uGust.value = 0.6 + 1.6 * g(t, 95.7, 0.4, 0.5, 1.8); Gy.set(t, 0.05 + 1.2 * rise(t, 95.55, 1.3)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[3.6, 0.8, 9.6], [2.6, 0.9, 10.4], [1.0, 1.0, 10.9], [-0.6, 1.2, 11.0]], look: [[0.4, 0.35, 7.2], [0.4, 0.3, 7.2], [0.3, 0.4, 7.2], [0.2, 0.9, 6.6]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.12 }),
});
