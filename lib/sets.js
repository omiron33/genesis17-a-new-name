// The hill of Mambre as a place to film: the camp under the oak, a stone to work on, the inside of the tent.
import * as THREE from 'three';
import { land, grass, flowers, stones, shrubs, bareField, height, rockGeo, instances } from '/song/lib/land.js';
import { oak } from '/song/lib/tree.js';
import * as K from '/song/lib/props.js';
import { flame, flames, glow, smoke, flick } from '/song/lib/fire.js';
import { br } from '/song/lib/shot.js';
import { M } from '/song/lib/core.js';
import { lerp } from '/song/lib/noise.js';
import { follow } from '/kit/motion.js';
export const G = height;
export const at = (x, z, dy = 0) => [x, height(x, z) + dy, z];
export const OAK = [0, -6];

// camp(S, { oak, tents, at, r, n (grass), dry, tall, flowers, spots, paths, rocks, scrub, far, altar, hearth, jars, keep })
export function camp(S, o = {}) {
  const sc = S.scene, c = o.at ?? [0, 2], bare = bareField([[0, 1, 4.2], [-8.5, -2.4, 3.4], [-4.6, 1.2, 1.8], ...(o.spots ?? [])], [[-8, -1, 0, 2, 1.2], [0, 2, 7, 12, 0.9], [3, 0, 10, -7, 0.8], ...(o.paths ?? [])]);
  const R = { bare }; R.land = land(sc, { center: c, bare, surf: o.surf, u: o.landU, fragHead: o.landHead, cast: o.landCast });
  if (o.n !== 0) grass(sc, { at: c, r: o.r ?? 13, n: o.n ?? 55000, bare, dry: o.dry ?? 0, tall: o.tall ?? 1, keep: o.keep });
  if (o.flowers !== 0) flowers(sc, { at: c, r: (o.r ?? 13) * 0.85, n: o.flowers ?? 380, bare });
  if (o.oak !== false) R.oak = oak(sc, { at: [OAK[0], height(...OAK), OAK[1]], ...(typeof o.oak === 'object' ? o.oak : {}) });
  const T = [[-9.2, -3.6, 0.42, 7.2, 1], [9.6, -10.5, -0.45, 6.2, 2], [-15.5, -13, 0.25, 6.0, 3], [17, -19, -0.2, 6.5, 4]]; R.tents = [];
  for (let i = 0; i < (o.tents ?? 2); i++) { const [x, z, rot, w, sd] = T[i]; R.tents.push(K.tent(sc, { p: at(x, z), rot, w, seed: sd, strips: 9 + sd, front: sd === 2 ? 0.6 : 1, ...(i === 0 ? { w: 7.6, hi: 2.3 } : {}), ...(o.tentOpt ?? {}) })); }
  stones(sc, { at: o.rocks ?? [[5.6, 1.2, 0.42, 8], [-6.6, 5.2, 0.34, 7], [7.6, 5.4, 0.55, 8], [2.6, -8.4, 0.5, 6], [-3.2, -8.2, 0.4, 6]], seed: 3 });
  shrubs(sc, { at: o.scrub ?? [[9.2, -3.2, 0.9], [-12, 3, 0.9], [11.5, 3.5, 0.75], [-5.4, -11, 1.0]], far: o.far === 0 ? null : [40, 420, o.far ?? 620] });
  if (o.altar) K.altar(sc, at(3.6, -1.2));
  if (o.hearth) R.hearth = hearth(S, at(-4.6, 1.2), o.hearth === true ? {} : o.hearth);
  if (o.jars) { K.jar(sc, at(-6.1, 0.4), { s: 1.05 }); K.jar(sc, at(-6.6, 0.9), { s: 0.8, seed: 2, rot: 1 }); K.jar(sc, at(-5.9, 1.2), { s: 0.62, seed: 3, rot: 2 }); K.jar(sc, at(-5.5, 0.2), { kind: 'pot', seed: 4, s: 0.9 }); K.bag(sc, at(-7.0, 0.1), { s: 1.3, seed: 3 }); K.rug(sc, [-8.0, undefined, -1.2].map((v, i) => (i === 1 ? undefined : v)), { w: 3, d: 1.5, rot: 0.42, seed: 3 }); }
  return R;
}
export function hearth(S, p, o = {}) {
  const sc = S.scene, list = []; for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; list.push({ p: [p[0] + Math.cos(a) * 0.42, p[1] + 0.05, p[2] + Math.sin(a) * 0.42], s: [0.14, 0.11, 0.13], r: [0, i * 1.7, 0.2] }); } instances(sc, rockGeo(51, 3), K.mat('limestone', { uvless: true, surf: 'alb *= .42;' }, 'sooty'), list);
  for (let i = 0; i < 5; i++) { const a = i * 1.26, P = [K.V(p[0] + Math.cos(a) * 0.36, p[1] + 0.03, p[2] + Math.sin(a) * 0.36), K.V(p[0] + Math.cos(a) * 0.1, p[1] + 0.16, p[2] + Math.sin(a) * 0.1), K.V(p[0] - Math.cos(a) * 0.02, p[1] + 0.26, p[2] - Math.sin(a) * 0.02)]; K.mesh(K.sweep(P, 0.034, { S: 9 }), K.mat('bark', { surf: 'alb *= .5;' }, 'charred'), sc); }
  const f = flames(sc, [{ p: [p[0], p[1] + 0.10, p[2]], h: 0.55, seed: 1 }, { p: [p[0] + 0.14, p[1] + 0.08, p[2] + 0.1], h: 0.36, seed: 4 }, { p: [p[0] - 0.13, p[1] + 0.08, p[2] - 0.05], h: 0.40, seed: 7 }], { wide: 1, gain: o.gain ?? 0.6 });
  const L = glow(sc, [p[0], p[1] + 0.45, p[2]], { color: [1, 0.48, 0.16], I: o.I ?? 6, shadow: o.shadow ?? false }), sm = o.smoke === 0 ? null : smoke(sc, { at: () => [p[0], p[1] + 0.7, p[2]], wind: o.wind ?? ((t) => [0.35 * br(t), 0, 0.10]), color: o.smokeCol ?? [0.60, 0.62, 0.68], a: 0.06 });
  return { L, set(t, k = 1) { L.intensity = (o.I ?? 6) * k * flick(t, 3); for (let i = 0; i < 3; i++) f.set(i, k); sm?.set(t); } };
}
// a wide flat stone at working height under the oak, the camp behind it
export function bench(S, o = {}) {
  const R = camp(S, { tents: 1, n: 26000, r: 11, flowers: 160, far: 300, ...o }); const x = o.bx ?? 0, z = o.bz ?? 2.2, y = G(x, z); K.slab(S.scene, [x, y - 0.05, z], { w: o.bw ?? 1.9, d: o.bd ?? 1.15, h: 0.66, seed: o.bseed ?? 7, tint: o.tint ?? 0.8 }); R.top = y + 0.585; R.p = [x, R.top, z]; return R;
}
// inside the great tent: goat-hair walls, rugs, vessels; daylight from the open side (towards +z)
export function inside(S, o = {}) {
  const sc = S.scene; land(sc, { center: [0, 0], bare: bareField([[0, 0, 7]]), nr: 150, na: 220 }); grass(sc, { at: [0, 9], r: 7, n: 12000, bare: bareField([[0, 0, 7]]) });
  K.tent(sc, { p: [0, G(0, 0), 0], rot: 0, w: 9.4, d: 5.6, hi: 2.7, lo: 1.5, strips: 13, seed: 5, cols: 4 });
  K.rug(sc, [0, undefined, 0.4], { w: 4.6, d: 2.2, seed: 2 }); K.rug(sc, [-3.0, undefined, -0.6], { w: 2.4, d: 1.4, seed: 5, rot: 0.2, a: [0.10, 0.07, 0.16], c: [0.55, 0.45, 0.30] }); K.rug(sc, [2.9, undefined, -0.4], { w: 2.2, d: 1.3, seed: 9, rot: -0.15, a: [0.30, 0.13, 0.04], b: [0.12, 0.04, 0.03] });
  if (o.dress !== false) { for (const [x, z, s, k] of [[-3.6, -2.0, 1.0, 'jar'], [-3.1, -2.2, 0.8, 'jar'], [-4.0, -1.5, 0.7, 'jar'], [3.7, -1.9, 1.05, 'jar'], [3.2, -2.2, 0.7, 'pot']]) K.jar(sc, at(x, z), { s, kind: k, seed: s * 9, rot: x }); K.bag(sc, at(2.4, -2.1), { s: 1.5, seed: 4 }); K.bag(sc, at(-2.3, -2.2), { s: 1.3, seed: 7, rot: 1 }); }
  // a woven dividing curtain along the back, hung in folds
  { const W = new THREE.PlaneGeometry(1, 1, 260, 24), q = W.attributes.position; for (let i = 0; i < q.count; i++) { const u = q.getX(i) + 0.5, v = 0.5 - q.getY(i), k = (Math.sin(u * 74 + 1.3 * Math.sin(u * 13)) * 0.055 + Math.sin(u * 31) * 0.03) * (0.55 + 0.45 * v), x = lerp(-4.3, 4.3, u), z = -2.28 + k; q.setXYZ(i, x, lerp(1.62 - 0.05 * Math.abs(Math.sin(u * 22)), G(x, z) + 0.02, v), z); } W.computeVertexNormals(); K.mesh(W, M('rug', { side: THREE.DoubleSide, u: { uSeed: 3, uBands: 9, uColA: [0.42, 0.15, 0.07], uColB: [0.50, 0.38, 0.24], uColC: [0.20, 0.10, 0.07] }, surf: 'alb *= .95;' }), sc); }
  const f = o.fill ?? 0.5; const L = new THREE.PointLight(new THREE.Color(1, 0.76, 0.52), 12 * f, 0, 1.2); L.position.set(0.3, 0.85, 1.5); sc.add(L); const L2 = new THREE.PointLight(new THREE.Color(0.75, 0.82, 1), 6 * f, 0, 1.2); L2.position.set(-2.5, 0.9, 2.4); sc.add(L2);
  return { fill: L };
}
// a staff that falls: angle from `lean` to flat, with one knock
export const falls = (t, t0, d = 0.85, end = 1.53) => { if (t <= t0) return 0; const k = Math.min(1, (t - t0) / d); if (k < 1) return end * Math.pow(k, 2.7); const q = t - t0 - d; return end - 0.085 * Math.abs(Math.sin(8.5 * q)) * Math.exp(-4.2 * q); };
export { K, flame, flames, glow, smoke, flick, follow };
