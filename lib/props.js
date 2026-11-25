// The things that act: staff, cord, seal and clay, lamps, cradle, jars, stones, rings, tents. Shapes made by
// turning, sweeping and weaving in code.
import * as THREE from 'three';
import { M } from '/song/lib/core.js';
import { rng, fbm3, n3, lerp, smooth, clamp } from '/song/lib/noise.js';
import { height, rockGeo, instances } from '/song/lib/land.js';
import { sheet, clothMesh, woolMat, COL } from '/song/lib/cloth.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const mesh = (geo, mat, parent, p) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; if (p) m.position.set(...p); parent?.add(m); return m; };
const CACHE = new Map(); export const mat = (k, o, key) => { const id = key ?? k + JSON.stringify(o ?? {}); if (!CACHE.has(id)) CACHE.set(id, M(k, o)); return CACHE.get(id); };

// ---- swept tubes
export function sweep(P, R, { S = 12, cap = true } = {}) {
  const n = P.length, pos = [], nor = [], uv = [], idx = []; let up = V(0.31, 0.83, 0.47), len = 0;
  for (let i = 0; i < n; i++) {
    const d = V().subVectors(P[Math.min(n - 1, i + 1)], P[Math.max(0, i - 1)]).normalize(); const a = up.clone().addScaledVector(d, -up.dot(d)).normalize(); up = a; const b = V().crossVectors(d, a); if (i) len += P[i].distanceTo(P[i - 1]);
    const r = typeof R === 'function' ? R(i / (n - 1), len) : R;
    for (let k = 0; k <= S; k++) { const q = k / S * 2 * Math.PI, c = Math.cos(q), s = Math.sin(q), v = a.clone().multiplyScalar(c).addScaledVector(b, s); pos.push(P[i].x + v.x * r, P[i].y + v.y * r, P[i].z + v.z * r); nor.push(v.x, v.y, v.z); uv.push(k / S, len); }
  }
  for (let i = 0; i + 1 < n; i++) for (let k = 0; k < S; k++) { const a = i * (S + 1) + k, b = a + S + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  if (cap) for (const [i, f] of [[0, 1], [n - 1, 0]]) { const c = pos.length / 3; pos.push(P[i].x, P[i].y, P[i].z); const d = V().subVectors(P[i], P[i ? i - 1 : 1]).normalize(); nor.push(d.x, d.y, d.z); uv.push(0.5, 0); for (let k = 0; k < S; k++) { const a = i * (S + 1) + k; f ? idx.push(c, a + 1, a) : idx.push(c, a, a + 1); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); return g;
}
// a tube whose path changes every frame
export function liveTube(scene, mt, { n = 90, S = 9, r = 0.01 } = {}) {
  const g = new THREE.BufferGeometry(), pos = new Float32Array(n * (S + 1) * 3), nor = new Float32Array(n * (S + 1) * 3), uv = new Float32Array(n * (S + 1) * 2), idx = [];
  for (let i = 0; i + 1 < n; i++) for (let k = 0; k < S; k++) { const a = i * (S + 1) + k, b = a + S + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = mesh(g, mt, scene); m.frustumCulled = false; const d = V(), a = V(), b = V(), up = V();
  return { mesh: m, n, set(f, show = 1, rad = r) {   // f(u) -> [x,y,z]; show: how much of its length is there
    const P = []; for (let i = 0; i < n; i++) P.push(V(...f(i / (n - 1) * show))); up.set(0.31, 0.83, 0.47); let len = 0;
    for (let i = 0; i < n; i++) { d.subVectors(P[Math.min(n - 1, i + 1)], P[Math.max(0, i - 1)]); if (d.lengthSq() < 1e-14) d.set(1, 0, 0); d.normalize(); a.copy(up).addScaledVector(d, -up.dot(d)).normalize(); up.copy(a); b.crossVectors(d, a); if (i) len += P[i].distanceTo(P[i - 1]); const rr = (typeof rad === 'function' ? rad(i / (n - 1) * show) : rad) * (i === 0 || i === n - 1 ? 0.35 : 1);
      for (let k = 0; k <= S; k++) { const q = k / S * 2 * Math.PI, c = Math.cos(q), s = Math.sin(q), o = (i * (S + 1) + k); const x = a.x * c + b.x * s, y = a.y * c + b.y * s, z = a.z * c + b.z * s; pos[o * 3] = P[i].x + x * rr; pos[o * 3 + 1] = P[i].y + y * rr; pos[o * 3 + 2] = P[i].z + z * rr; nor[o * 3] = x; nor[o * 3 + 1] = y; nor[o * 3 + 2] = z; uv[o * 2] = k / S; uv[o * 2 + 1] = len; } }
    g.attributes.position.needsUpdate = g.attributes.normal.needsUpdate = g.attributes.uv.needsUpdate = true; m.visible = show > 0.002;
  } };
}
export const flaxMat = () => mat('rope', { u: { uTwist: 420, uCol: [0.56, 0.46, 0.30] } }, 'flax');
export const lightMat = (k = 1) => { const m = M('rope', { u: { uTwist: 420, uCol: [1.0, 0.78, 0.40], uK: k }, surf: 'rough = .35; emit = vec3(1., .74, .34) * uK * (1.6 + .9 * tw + .5 * f);' }); m.userData.setK = (x) => { m.userData.u.uK.value = x; }; return m; };
// the covenant cord: a strand of flax and a strand of light, laid together. c(u) -> centre; turns along it
export function coveCord(scene, { n = 150, r = 0.012, turns = 14, parent } = {}) {
  const LM = lightMat(1); const A = liveTube(parent ?? scene, flaxMat(), { n: n * 2, r, S: 12 }), B = liveTube(parent ?? scene, LM, { n: n * 2, r: r * 0.92, S: 12 });
  const tw = (c, ph, R) => (u) => { const e = 1e-3, p = V(...c(u)), q = V(...c(Math.min(1, u + e))), o = V(...c(Math.max(0, u - e))); const d = q.sub(o).normalize(); const a = V(0.31, 0.83, 0.47); a.addScaledVector(d, -a.dot(d)).normalize(); const b = V().crossVectors(d, a); const th = u * turns * 2 * Math.PI + ph, rr = R(u); p.addScaledVector(a, Math.cos(th) * rr).addScaledVector(b, Math.sin(th) * rr); return [p.x, p.y, p.z]; };
  return { A, B, LM, set(c, { showA = 1, showB = 1, open = () => r * 0.85, k = 1 } = {}) { A.set(tw(c, 0, open), showA); B.set(tw(c, Math.PI, open), showB); LM.userData.setK(k); } };
}
// ---- the staff (Abram, Abraam). Grounded at its foot; h 1.75 m, a worn hook of olive wood
export const staffCentre = (y, h = 1.75, seed = 2, hook = true) => { const k = Math.min(1, Math.max(0, y / (h * (hook ? 0.86 : 1)))); return [(fbm3(k * 3.1 + seed, 1.2, 0, 3) - 0.5) * 0.09 * smooth(0, 0.2, k), y, (fbm3(k * 2.7, 5.2 + seed, 0, 3) - 0.5) * 0.09 * smooth(0, 0.2, k)]; };
export function staffGeo(h = 1.75, seed = 2, hook = true) {
  const P = []; const n = 60, H = h * (hook ? 0.86 : 1); for (let i = 0; i <= n; i++) P.push(V(...staffCentre(i / n * H, h, seed, hook)));
  if (hook) { const t = P[P.length - 1].clone(); for (let i = 1; i <= 34; i++) { const a = i / 34 * 3.75, R = h * 0.082; P.push(V(t.x + R - Math.cos(a) * R * (1 - 0.1 * i / 34), t.y + Math.sin(a) * R * 1.12, t.z + 0.012 * i / 34)); } }
  return sweep(P, (u) => (0.021 + 0.006 * (1 - u) + 0.0060 * (fbm3(u * 14 + seed, 3, 1, 3) - 0.5) * 2 + 0.0055 * smooth(0.02, 0, Math.abs(u - 0.37)) + 0.005 * smooth(0.02, 0, Math.abs(u - 0.71)) + 0.004 * smooth(0.015, 0, Math.abs(u - 0.22))) * (u > 0.97 ? 0.8 : 1), { S: 22 });
}
export function staff(scene, { p = [0, 0, 0], h = 1.75, seed = 2, hook = true, wrap = true, wood = 'wood' } = {}) {
  const g = new THREE.Group(); g.position.set(...p); mesh(staffGeo(h, seed, hook), mat(wood), g);
  if (wrap) { const P = []; for (let i = 0; i <= 260; i++) { const k = i / 260, a = k * 2 * Math.PI * 10, y = h * (0.55 + 0.075 * k), c = staffCentre(y, h, seed, hook); P.push(V(c[0] + Math.cos(a) * 0.0275, y, c[2] + Math.sin(a) * 0.0275)); } mesh(sweep(P, 0.0062, { S: 8 }), mat('leather', { uvless: true }), g); }
  scene.add(g); return g;
}
// lean a thing: foot at p, tilted by `a` towards heading `az`
export function lean(o, a, az) { o.rotation.set(0, 0, 0); o.setRotationFromAxisAngle(V(Math.cos(az), 0, -Math.sin(az)), a); }
// ---- turned vessels
const PROFILE = {
  jar: [[0, 0], [0.10, 0], [0.145, 0.02], [0.19, 0.10], [0.225, 0.22], [0.23, 0.32], [0.20, 0.43], [0.14, 0.50], [0.095, 0.54], [0.085, 0.58], [0.10, 0.62], [0.115, 0.635], [0.105, 0.64], [0.08, 0.60], [0.075, 0.55], [0.09, 0.50], [0.16, 0.42], [0.19, 0.32], [0.18, 0.2], [0.12, 0.04], [0, 0.03]],
  pot: [[0, 0], [0.12, 0.01], [0.20, 0.07], [0.24, 0.16], [0.22, 0.25], [0.17, 0.29], [0.185, 0.32], [0.20, 0.33], [0.185, 0.335], [0.16, 0.30], [0.20, 0.24], [0.215, 0.16], [0.17, 0.06], [0, 0.04]],
  bowl: [[0, 0], [0.07, 0], [0.09, 0.015], [0.16, 0.06], [0.205, 0.12], [0.215, 0.135], [0.208, 0.14], [0.195, 0.125], [0.15, 0.07], [0.08, 0.03], [0, 0.025]],
  cup: [[0, 0], [0.045, 0], [0.05, 0.01], [0.06, 0.06], [0.07, 0.11], [0.072, 0.118], [0.066, 0.115], [0.054, 0.06], [0.04, 0.015], [0, 0.012]],
  measure: [[0, 0], [0.20, 0], [0.205, 0.01], [0.215, 0.16], [0.22, 0.30], [0.225, 0.31], [0.205, 0.312], [0.20, 0.30], [0.195, 0.16], [0.185, 0.02], [0, 0.02]],
};
export function turned(kind, S = 72, seed = 1) {
  const pts = new THREE.SplineCurve(PROFILE[kind].map((q) => new THREE.Vector2(...q))).getPoints(PROFILE[kind].length * 6).map((q) => new THREE.Vector2(Math.max(q.x, 1e-4), q.y));
  const g = new THREE.LatheGeometry(pts, S), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.035 * (fbm3(x * 5 + seed * 7, y * 5, z * 5, 2) - 0.5); p.setXYZ(i, x * k, y, z * k); } g.computeVertexNormals(); return g;
}
export function jar(scene, p, { s = 1, kind = 'jar', mt = 'clay', seed = 1, handles = kind === 'jar', rot = 0 } = {}) {
  const g = new THREE.Group(); g.position.set(...p); g.rotation.y = rot; g.scale.setScalar(s); const m = typeof mt === 'string' ? mat(mt, { side: THREE.DoubleSide }) : mt; mesh(turned(kind, 72, seed), m, g);
  if (handles) for (const q of [0, Math.PI]) { const P = []; for (let i = 0; i <= 20; i++) { const a = i / 20, x = 0.10 + Math.sin(a * Math.PI) * 0.115 + 0.07 * a, y = 0.585 - a * 0.185; P.push(V(Math.cos(q) * x, y, Math.sin(q) * x)); } mesh(sweep(P, 0.019, { S: 10 }), m, g); }
  scene.add(g); return g;
}
// an oil lamp: a pinched clay saucer, its wick and flame point
export function lampGeo() {
  const g = turned('bowl', 72, 3), p = g.attributes.position; for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const a = Math.atan2(z, x), k = Math.exp(-a * a * 9) * smooth(0.05, 0.14, y); x *= 1 + 0.26 * k; z *= 1 - 0.45 * k; p.setXYZ(i, x * 0.36, y * 0.42, z * 0.36); } g.computeVertexNormals(); return g;
}
export const WICK = [0.082, 0.050, 0];
export function lampBody(scene, p, { s = 1, rot = 0, mt = 'clay' } = {}) {
  const g = new THREE.Group(); g.position.set(...p); g.rotation.y = rot; g.scale.setScalar(s); mesh(LAMPG ??= lampGeo(), mat(mt, { side: THREE.DoubleSide }), g);
  const oil = mesh(new THREE.CircleGeometry(0.055, 32), M('plain', { surf: 'alb = vec3(.16, .10, .02); rough = .06;' }), g, [0, 0.038, 0]); oil.rotation.x = -Math.PI / 2; oil.castShadow = false;
  mesh(sweep([V(0.02, 0.040, 0), V(0.05, 0.044, 0), V(0.075, 0.047, 0), V(0.084, 0.052, 0)], 0.0035, { S: 6 }), mat('plain', { surf: 'alb = vec3(.05, .04, .03);' }, 'wick'), g);
  scene.add(g); return { g, tip: () => g.localToWorld(V(...WICK)).toArray() };
}
let LAMPG = null;
// ---- the hanging cradle (the child who is promised): a woven boat with rockers or ropes
export function cradleGeo(L = 0.72, W = 0.36, H = 0.24) {
  const pos = [], uv = [], idx = [], A = 96, B = 26; for (let s = 0; s < 2; s++) for (let j = 0; j <= B; j++) for (let i = 0; i <= A; i++) { const a = i / A * 2 * Math.PI, k = j / B, e = Math.pow(Math.sin(k * Math.PI / 2), 0.62), c = Math.cos(a), sn = Math.sin(a), sq = 1 / Math.pow(Math.pow(Math.abs(c), 2.6) + Math.pow(Math.abs(sn), 2.6), 1 / 2.6), y = H * Math.pow(k, 1.5) + 0.05 * k * c * c * sq * sq; const t = s ? 0.986 : 1; pos.push(c * sq * L / 2 * e * t, y + (s ? 0.010 : 0), sn * sq * W / 2 * e * t); uv.push(i / A * 2, k * 0.8); }
  const w = A + 1, o = (B + 1) * w; for (let s = 0; s < 2; s++) for (let j = 0; j < B; j++) for (let i = 0; i < A; i++) { const a = s * o + j * w + i, b = a + w; s ? idx.push(a, a + 1, b, b, a + 1, b + 1) : idx.push(a, b, a + 1, b, b + 1, a + 1); }
  for (let i = 0; i < A; i++) { const a = B * w + i, b = a + o; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
export function cradle(scene, p, { rot = 0, s = 1, ropes = 0, rockers = true, bed = true, bedCol = COL.cream, hoop = false } = {}) {
  const g = new THREE.Group(); g.position.set(...p); g.rotation.y = rot; g.scale.setScalar(s); const inner = new THREE.Group(); g.add(inner); const L = 0.72, W = 0.36, H = 0.24;
  const b = new THREE.Group(); inner.add(b); b.position.y = rockers ? 0.125 : 0; mesh(cradleGeo(L, W, H), mat('basket', { u: { uThreads: 52 }, side: THREE.DoubleSide }), b);
  const rim = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * 2 * Math.PI, c = Math.cos(a), sn = Math.sin(a), sq = 1 / Math.pow(Math.pow(Math.abs(c), 2.6) + Math.pow(Math.abs(sn), 2.6), 1 / 2.6); rim.push(V(c * sq * L / 2, H + 0.05 * c * c * sq * sq + 0.006, sn * sq * W / 2)); } mesh(sweep(rim, 0.015, { S: 10, cap: false }), mat('rope', { u: { uTwist: 260, uCol: [0.50, 0.36, 0.17] } }), b);
  if (rockers) for (const x of [-0.23, 0.23]) { const P = []; for (let i = 0; i <= 30; i++) { const a = (i / 30 - 0.5) * 1.15; P.push(V(x, 0.52 - Math.cos(a) * 0.50 + 0.004, Math.sin(a) * 0.50)); } mesh(sweep(P, 0.019, { S: 12 }), mat('wood'), inner); for (const z of [-0.14, 0.14]) mesh(sweep([V(x, 0.05, z * 1.2), V(x, 0.20, z), V(x, 0.36, z * 1.18)], 0.014, { S: 9 }), mat('wood'), inner); mesh(sweep([V(x, 0.115, -0.17), V(x, 0.115, 0.17)], 0.014, { S: 9 }), mat('wood'), inner); }
  if (bed) { const q = new THREE.SphereGeometry(1, 48, 24), pp = q.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); pp.setXYZ(i, x * L * 0.45, 0.10 + y * 0.055 + 0.022 * fbm3(x * 3, z * 3, 2, 3), z * W * 0.43); } q.computeVertexNormals(); mesh(q, woolMat(bedCol, { threads: 90, transl: 0 }), b); }
  const bells = []; if (hoop) { const P = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI; P.push(V(0.10, 0.36 + Math.sin(a) * 0.34, Math.cos(a) * 0.185)); } mesh(sweep(P, 0.012, { S: 10 }), mat('paleWood'), inner); for (let i = 0; i < 3; i++) { const a = Math.PI * (0.30 + 0.20 * i); bells.push(bell(inner, [0.10, 0.36 + Math.sin(a) * 0.335, Math.cos(a) * 0.182], { s: 0.72, mt: 'gold' })); } }
  scene.add(g); return { g, body: inner, bells, rock(a) { inner.rotation.x = a; inner.position.y = 0; inner.position.z = -a * 0.50; } };
}
// ---- tents of goat hair: the roof is a real sheet laid over its poles and drawn down to its pegs
export function tent(scene, { p = [0, 0, 0], rot = 0, w = 7, d = 4.2, hi = 2.1, lo = 1.15, strips = 11, seed = 1, front = 1, wall = true, cols = 3 } = {}) {
  const g = new THREE.Group(); g.position.set(p[0], p[1], p[2]); g.rotation.y = rot; scene.add(g);
  const c = Math.cos(rot), s = Math.sin(rot), gy = (x, z) => height(p[0] + x * c + z * s, p[2] - x * s + z * c) - p[1];
  const poles = []; for (let i = 0; i < cols; i++) { const x = (i / (cols - 1) - 0.5) * w * 0.82; poles.push([x, hi * (1 - 0.06 * Math.abs(i - (cols - 1) / 2)), 0]); poles.push([x, lo * 1.12, d * 0.46]); poles.push([x, lo, -d * 0.46]); }
  const nx = 46, ny = 30; const near = new Map(); for (const [x, y, z] of poles) { const i = Math.round((x / (w * 1.04) + 0.5) * (nx - 1)), j = Math.round((z / (d * 1.1) + 0.5) * (ny - 1)); near.set(j * nx + i, [x, y, z]); }
  for (const i of [0, nx - 1]) for (const j of [0, Math.round(ny * 0.5), ny - 1]) { const x = (i / (nx - 1) - 0.5) * w * 1.16, z = (j / (ny - 1) - 0.5) * d * 1.16; near.set(j * nx + i, [x, j > 2 && j < ny - 2 ? lo * 0.62 : lo * 0.52, z]); }
  const S = sheet({ w: w * 1.16, h: d * 1.2, nx, ny, t0: 0, seed, damp: 0.975, aero: 1.2, turb: 0.2, iter: 12, bend: 0.12, rest: (u, v) => [(u - 0.5) * w * 1.06, lerp(hi, lo, Math.abs(v - 0.5) * 2) + 0.1, (v - 0.5) * d * 1.12], pin: (i, j) => { const q = near.get(j * nx + i); return q ? () => q : null; }, wind: () => [0, 0, 0], ground: gy });
  const hm = mat('hair', { side: THREE.DoubleSide, u: { uStrips: strips }, uvSwap: 1 }, 'hair' + strips); const R = clothMesh(g, S, hm, { sub: 2 }); R.set(1.6);
  for (const [x, y, z] of poles) mesh(sweep([V(x * 1.0, gy(x, z) - 0.1, z), V(x + 0.02, y * 0.5, z), V(x, y + 0.05, z)], 0.032, { S: 10 }), mat('wood'), g);
  const ropeM = flaxMat(); const guy = (a, b) => { const P = []; for (let i = 0; i <= 14; i++) { const k = i / 14; P.push(V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) - 0.10 * 4 * k * (1 - k), lerp(a[2], b[2], k))); } mesh(sweep(P, 0.011, { S: 6 }), ropeM, g); mesh(sweep([V(b[0], gy(b[0], b[2]) - 0.1, b[2]), V(b[0] + (b[0] - a[0]) * 0.03, gy(b[0], b[2]) + 0.17, b[2] + (b[2] - a[2]) * 0.03)], 0.02, { S: 7 }), mat('wood'), g); };
  for (const [x, y, z] of poles) if (z) { const zz = z + Math.sign(z) * 1.5; guy([x, y, z], [x * 1.05, gy(x * 1.05, zz) + 0.12, zz]); }
  for (const sx of [-1, 1]) for (const z of [-d * 0.5, 0, d * 0.5]) { const x = sx * w * 0.58; guy([x, lo * 0.56, z], [x + sx * 1.3, gy(x + sx * 1.3, z * 1.2) + 0.12, z * 1.2]); }
  if (wall) {
    const curtain = (a, b, hh, sd) => { const D = Math.hypot(b[0] - a[0], b[2] - a[2]), n = [-(b[2] - a[2]) / D, (b[0] - a[0]) / D]; const W = new THREE.PlaneGeometry(1, 1, 90, 20), q = W.attributes.position; for (let i = 0; i < q.count; i++) { const u = q.getX(i) + 0.5, v = 0.5 - q.getY(i), k = (Math.sin(u * 38 + sd) * 0.5 + Math.sin(u * 71 + sd * 2) * 0.3) * (0.025 + 0.06 * v) + 0.05 * Math.sin(u * 9 + sd); const x = lerp(a[0], b[0], u) + n[0] * k, z = lerp(a[2], b[2], u) + n[1] * k; const top = lerp(a[1], b[1], u) - 0.12 * Math.abs(Math.sin(u * Math.PI * (cols - 1))); q.setXYZ(i, x, lerp(top, gy(x, z) + 0.01, v), z); } W.computeVertexNormals(); mesh(W, hm, g); };
    curtain([-w * 0.5, lo, -d * 0.46], [w * 0.5, lo, -d * 0.46], lo, seed); curtain([-w * 0.5, lo * 0.9, -d * 0.46], [-w * 0.5, lo * 0.8, d * 0.4], lo, seed + 3); curtain([w * 0.5, lo * 0.9, -d * 0.46], [w * 0.5, lo * 0.8, d * 0.4], lo, seed + 5);
    if (front < 1) curtain([-w * 0.5, lo, d * 0.46], [-w * 0.5 + w * (1 - front), lo, d * 0.46], lo, seed + 8);
  }
  return g;
}
export function rug(scene, p, { w = 2.2, d = 1.2, rot = 0, seed = 1, a, b, c, y = 0.015 } = {}) {
  const g = new THREE.PlaneGeometry(w, d, 60, 34); g.rotateX(-Math.PI / 2); const q = g.attributes.position, cs = Math.cos(rot), sn = Math.sin(rot); for (let i = 0; i < q.count; i++) { const x = q.getX(i), z = q.getZ(i), X = p[0] + x * cs + z * sn, Z = p[2] - x * sn + z * cs; q.setXYZ(i, X, (p[1] ?? height(X, Z)) + height(X, Z) * (p[1] === undefined ? 0 : 0) + y + 0.012 * fbm3(X * 2.2, Z * 2.2, seed, 2), Z); } g.computeVertexNormals();
  return mesh(g, M('rug', { side: THREE.DoubleSide, u: { uSeed: seed, ...(a ? { uColA: a } : {}), ...(b ? { uColB: b } : {}), ...(c ? { uColC: c } : {}) } }), scene);
}
// a post and line
export function line(scene, a, b, { r = 0.011, posts = true, sag = 0.05 } = {}) {
  const P = []; for (let i = 0; i <= 30; i++) { const k = i / 30; P.push(V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) - sag * 4 * k * (1 - k), lerp(a[2], b[2], k))); } mesh(sweep(P, r, { S: 7 }), flaxMat(), scene);
  if (posts) for (const q of [a, b]) { const y = height(q[0], q[2]), T = q[1] + 0.12, pts = []; for (let i = 0; i <= 12; i++) { const k = i / 12; pts.push(V(q[0] + (fbm3(k * 2 + q[0], 3, 1, 2) - 0.5) * 0.07, lerp(y - 0.2, T, k), q[2] + (fbm3(k * 2 + q[2], 8, 1, 2) - 0.5) * 0.07)); } mesh(sweep(pts, (u) => 0.042 - 0.012 * u, { S: 12 }), mat('wood'), scene); }
}
// a flat-topped stone to set things on (and the altar of fieldstones)
export function slab(scene, p, { w = 1.6, d = 1.1, h = 0.5, seed = 4, rot = 0, tint = 1 } = {}) {
  const g = new THREE.BoxGeometry(1, 1, 1, 46, 20, 40), q = g.attributes.position; const v = V();
  for (let i = 0; i < q.count; i++) { v.fromBufferAttribute(q, i); const e = 5, l = Math.pow(Math.pow(Math.abs(v.x * 2), e) + Math.pow(Math.abs(v.z * 2), e), 1 / e) || 1, m = Math.max(Math.abs(v.x * 2), Math.abs(v.z * 2)) || 1; v.x *= m / l; v.z *= m / l; const n = fbm3(v.x * 2.2 + seed, v.y * 1.5, v.z * 2.2, 4) - 0.5, n2 = fbm3(v.x * 8, v.y * 8 + seed, v.z * 8, 3) - 0.5, side = smooth(0.40, 0.5, Math.max(Math.abs(v.x), Math.abs(v.z))); v.x *= 1 + n * 0.28 + n2 * 0.05; v.z *= 1 + n * 0.28 + n2 * 0.05; if (v.y > 0.3) v.y += n2 * 0.03 - side * 0.07; q.setXYZ(i, v.x * w, (v.y + 0.5) * h, v.z * d); }
  g.computeVertexNormals(); const m = mesh(g, mat('limestone', { uvless: true, surf: `alb *= ${tint.toFixed(2)};` }, 'slab' + tint), scene, p); m.rotation.y = rot; return m;
}
export function altar(scene, p, { w = 1.7, d = 1.3, h = 0.85, seed = 2 } = {}) {
  const r = rng(seed), sets = [[], [], []]; const rows = 4; for (let k = 0; k < rows; k++) { const y = p[1] + (k + 0.5) * h * 0.74 / rows, per = 2 * (w + d), n = Math.round(per / 0.34); for (let i = 0; i < n; i++) { let q = ((i + 0.5 * (k % 2) + (r() - 0.5) * 0.3) / n) * per, x, z; if (q < w) { x = q - w / 2; z = d / 2; } else if (q < w + d) { x = w / 2; z = d / 2 - (q - w); } else if (q < 2 * w + d) { x = w / 2 - (q - w - d); z = -d / 2; } else { x = -w / 2; z = -d / 2 + (q - 2 * w - d); } const s = 0.135 + 0.10 * r() * r() + 0.02 * r(); sets[i % 3].push({ p: [p[0] + x * 0.86, y + (r() - 0.5) * 0.06, p[2] + z * 0.86], s: [s * (1.05 + 0.5 * r()), s * (0.85 + 0.3 * r()), s * 1.15], r: [(r() - 0.5) * 0.7, r() * 6.28, (r() - 0.5) * 0.7] }); } }
  sets.forEach((l, i) => instances(scene, rockGeo(40 + i * 3, 4, 0.9), mat('limestone', { uvless: true }), l)); return slab(scene, [p[0], p[1] + h * 0.72, p[2]], { w: w * 1.02, d: d * 1.02, h: h * 0.28, seed });
}
// the tally: ninety-nine pale stones in one slow spiral
export function tallySpots(c, n = 99, r0 = 0.16, dr = 0.0125, gap = 0.125) { const out = []; let a = 0, r = r0; for (let i = 0; i < n; i++) { const x = c[0] + Math.cos(a) * r, z = c[2] + Math.sin(a) * r; out.push([x, height(x, z), z, a]); a += gap / r; r += dr * gap / r * 1.6 + 0.0021; } return out; }
export function tally(scene, c, { n = 99, skip = [] } = {}) {
  const r = rng(6), sets = [[], []]; tallySpots(c, n).forEach(([x, y, z], i) => { if (skip.includes(i)) return; const s = 0.034 + 0.016 * r(); sets[i % 2].push({ p: [x, y + s * 0.45, z], s: [s * 1.15, s, s], r: [(r() - 0.5) * 0.6, r() * 6.28, (r() - 0.5) * 0.6] }); });
  sets.forEach((l, i) => instances(scene, pebbleGeo(i), mat('paleStone', { uvless: true }), l));
}
export const pebbleGeo = (i = 0) => { const g = new THREE.SphereGeometry(1, 28, 20), p = g.attributes.position; for (let k = 0; k < p.count; k++) { const x = p.getX(k), y = p.getY(k), z = p.getZ(k), q = 1 + 0.30 * (fbm3(x * 1.3 + i * 5, y * 1.3, z * 1.3, 2) - 0.5); p.setXYZ(k, x * q * 1.1, y * q * 0.72, z * q * 0.95); } g.computeVertexNormals(); return g; };
// the seal: a small stone cylinder on a cord; its relief is a height field, the same one it leaves in clay
export const SEAL = /* glsl */ `
float star4(vec2 p, float r) { p = abs(p); float a = p.x + p.y * 3.2, b = p.y + p.x * 3.2; return smoothstep(r, r * .55, min(a, b)); }
// the new mark: a great tree, its crown of leaves
float treeMark(vec2 p) { float k = smoothstep(.07, .035, abs(p.x) - .035 - .05 * smoothstep(-.35, -.66, p.y)) * step(p.y, .10) * step(-.64, p.y);
  for (int i = 0; i < 6; i++) { float a = -1.25 + .5 * float(i); vec2 d = vec2(sin(a), cos(a)), b = p - vec2(0., -.06); float t = clamp(dot(b, d), 0., .34); k = max(k, smoothstep(.045, .02, length(b - d * t))); }
  vec2 c = (p - vec2(0., .22)) * vec2(1., 1.12); float rad = length(c), an = atan(c.x, c.y); for (int q = 0; q < 4; q++) { float fj = float(q), rj = .10 + .125 * fj, n = 5. + 5. * fj; float ai = (fract(an / 6.2832 * n + .5 * fj) - .5) * 6.2832 / n; k = max(k, smoothstep(.062, .040, length(vec2(rad - rj, ai * rad)))); } return k; }
// the old mark: a lone tent between two plain lines
float sealOld(vec2 q) { vec2 p = vec2(fract(q.x) - .5, q.y - .5); p.x *= 1.7; float tri = abs(p.x) * .9 + p.y * .75 - .10; float t = smoothstep(.030, .014, abs(tri + .03)) * step(-.22, p.y) * step(p.y, .20); t = max(t, smoothstep(.026, .012, abs(p.y + .20)) * step(abs(p.x), .34)); t = max(t, smoothstep(.024, .010, abs(p.x)) * step(-.20, p.y) * step(p.y, .02)); return max(t, smoothstep(.03, .015, abs(abs(p.y) - .40))); }
float sealNew(vec2 q) { float x = fract(q.x); vec2 p = vec2(x - .5, q.y - .5); p.x *= 1.39; float h = smoothstep(.026, .012, abs(abs(p.y) - .445)); h = max(h, treeMark(p * 1.75 + vec2(0., -.02))); vec2 s = vec2(abs(p.x) - .52, p.y); for (int i = 0; i < 3; i++) h = max(h, star4(s - vec2(.0 + .06 * mod(float(i), 2.), -.27 + .27 * float(i)), .085)); return h; }
// the seal pressed in a round of clay: the same tree, among stars
float roundMark(vec2 c) { float k = treeMark(c * 1.5 + vec2(0., .02)); for (int i = 0; i < 10; i++) { float a = float(i) * .62832 + .31416; k = max(k, star4(c - vec2(sin(a), cos(a)) * .685, .105)); } return max(k, smoothstep(.045, .02, abs(length(c) - .87))); }`;
export function sealMesh(scene, { r = 0.045, h = 0.11, now = 1 } = {}) {
  const g = new THREE.Group(); const G = new THREE.CylinderGeometry(r, r, h, 64, 24, false); const m = M('plain', { u: { uNew: now, uLit: 0 }, fragHead: SEAL, surf: `float f = fb(p * 60.); alb = mix(vec3(.17, .045, .03), vec3(.42, .12, .06), f); vec2 q = vec2(uv.x * 1., uv.y); float k = abs(n.y) > .8 ? 0. : mix(sealOld(q), sealNew(q), uNew); alb *= 1. - .6 * k; rough = .24 + .3 * k; h = -.0016 * k; emit = vec3(1., .70, .30) * k * uLit * 1.6;`, clearcoat: 0.6 });
  const c = mesh(G, m, g); for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(r * 1.06, r * 1.06, 0.008, 48), mat('gold'), g, [0, s * h / 2, 0]); scene.add(g); return { g, c, m };
}
// a slab of wet clay; `print(uv)` GLSL adds relief. size in metres
export function clayBed(scene, p, { w = 0.9, d = 0.34, h = 0.05, u = {}, print = '', wet = 1 } = {}) {
  const g = new THREE.BoxGeometry(w, h, d, 160, 6, 60), q = g.attributes.position; for (let i = 0; i < q.count; i++) { let x = q.getX(i), y = q.getY(i), z = q.getZ(i); const e = Math.max(Math.abs(x) / (w / 2), Math.abs(z) / (d / 2)), n = fbm3(x * 9, y * 9, z * 9, 3) - 0.5; const k = 1 + n * 0.10; if (y > 0) y -= 0.014 * smooth(0.82, 1, e) ; q.setXYZ(i, x * k, y + n * 0.004, z * (1 + n * 0.14)); } g.computeVertexNormals();
  const m = M(wet ? 'wetClay' : 'clay', { u, fragHead: SEAL, surf: `vec2 cp = p.xz; float top = smoothstep(.4, .8, n.y); ${print}` }); const o = mesh(g, m, scene, [p[0], p[1] + h / 2, p[2]]); return { m, mesh: o };
}
// a round clay token; mark 0..1 how deep the seal sits, lit how it glows
export function token(scene, p, { r = 0.085, mark = 1, hole = true, dry = 1 } = {}) {
  const g = new THREE.CylinderGeometry(r, r * 0.97, 0.026, 64, 4), q = g.attributes.position; for (let i = 0; i < q.count; i++) { const x = q.getX(i), y = q.getY(i), z = q.getZ(i), k = 1 + 0.07 * (fbm3(x * 14 + p[0] * 9, y * 9, z * 14, 2) - 0.5); q.setXYZ(i, x * k, y, z * k); } g.computeVertexNormals();
  const m = M('wetClay', { u: { uMark: mark, uLit: 0, uR: r }, fragHead: SEAL, surf: `vec2 c = vec2(p.x, n.y > 0. ? -p.z : p.z) / uR; float top = smoothstep(.5, .9, abs(n.y)); float rr = length(c); float k = roundMark(c); k *= top * uMark; h += -.0045 * k ; alb = mix(alb * ${dry ? '1.55' : '1.15'}, alb * ${dry ? '2.6' : '.55'}, k); rough = mix(rough, .55, ${dry ? '.8' : '.2'}); emit = vec3(1., .72, .32) * k * uLit * 1.7;` });
  const t = mesh(g, m, scene, p); return { mesh: t, m, set(mark, lit) { m.userData.u.uMark.value = mark; m.userData.u.uLit.value = lit; } };
}
// the hand seal: a broad flat disc of dark stone with a loop of flax through it
export function discSeal(scene, { r = 0.10 } = {}) {
  const g = new THREE.Group(); const pr = [[0.001, 0], [0.96, 0], [1.0, 0.04], [1.0, 0.16], [0.92, 0.24], [0.5, 0.30], [0.001, 0.32]].map((q) => new THREE.Vector2(q[0] * r, q[1] * r)); mesh(new THREE.LatheGeometry(pr, 72), mat('plain', { uvless: true, surf: 'float f = fb(p * 30.), v = fb(p * 8. + 4.); alb = mix(vec3(.055, .06, .065), vec3(.16, .165, .17), f); alb = mix(alb, vec3(.34, .33, .31), smoothstep(.60, .66, v) * .6); rough = .42 + .2 * f; h = .0006 * f;' }, 'discseal'), g); const P = []; for (let i = 0; i <= 40; i++) { const a = -0.35 + (Math.PI + 0.7) * i / 40; P.push(V(Math.cos(a) * r * 0.34, r * 0.26 + Math.sin(a) * r * 0.40, 0.012 * Math.sin(a * 3))); } mesh(sweep(P, r * 0.055, { S: 9 }), flaxMat(), g); scene.add(g); return g;
}
// a ring of beaten gold
export function circlet(scene, { R = 0.16, pts = 9 } = {}) {
  const g = new THREE.Group(), pos = [], uv = [], idx = [], A = 180, B = 14, hh = 0.052; for (let s = 0; s < 2; s++) for (let j = 0; j <= B; j++) for (let i = 0; i <= A; i++) { const a = i / A * 2 * Math.PI, k = j / B, pk = Math.pow(0.5 + 0.5 * Math.cos(a * pts), 1.6) * 0.030, r = R * (1 + 0.035 * k) + (s ? -0.0035 : 0); pos.push(Math.cos(a) * r, k * (hh + pk) - hh * 0.5, Math.sin(a) * r); uv.push(i / A * 6, k); }
  const w = A + 1, o = (B + 1) * w; for (let s = 0; s < 2; s++) for (let j = 0; j < B; j++) for (let i = 0; i < A; i++) { const a = s * o + j * w + i, b = a + w; s ? idx.push(a, a + 1, b, b, a + 1, b + 1) : idx.push(a, b, a + 1, b, b + 1, a + 1); } for (const j of [0, B]) for (let i = 0; i < A; i++) { const a = j * w + i, b = a + o; j ? idx.push(a, b, a + 1, b, b + 1, a + 1) : idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const G = new THREE.BufferGeometry(); G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); G.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); G.setIndex(idx); G.computeVertexNormals(); mesh(G, M('gold', { side: THREE.DoubleSide, surf: 'float tw = smoothstep(.03, .0, abs(uv.y - .12)) + smoothstep(.03, .0, abs(uv.y - .62)); vec2 dq = fract(vec2(uv.x * 9., uv.y * 3.4)) - .5; h += .0012 * smoothstep(.26, .10, length(dq)) * step(.2, uv.y) * step(uv.y, .58) + .0012 * tw;' }), g); scene.add(g); return g;
}
// a goat bell of bronze, its tongue hung inside
export function bell(scene, p, { s = 1, mt = 'bronze' } = {}) {
  const g = new THREE.Group(); g.position.set(...p); const pr = [[0.001, 0.0], [0.018, -0.004], [0.030, -0.016], [0.034, -0.04], [0.038, -0.075], [0.046, -0.095], [0.043, -0.096], [0.035, -0.075], [0.031, -0.04], [0.026, -0.018], [0.001, -0.006]].map((q) => new THREE.Vector2(...q)); const sw = new THREE.Group(); g.add(sw); mesh(new THREE.LatheGeometry(pr, 40), mat(mt, { side: THREE.DoubleSide, uvless: true }, 'bell' + mt), sw, [0, -0.03, 0]); mesh(new THREE.TorusGeometry(0.014, 0.004, 8, 20), mat('bronze', {}, 'bronzeF'), sw, [0, -0.018, 0]);
  const tg = new THREE.Group(); tg.position.y = -0.04; sw.add(tg); mesh(sweep([V(0, 0, 0), V(0, -0.05, 0)], 0.003, { S: 6 }), mat('bronze', {}, 'bronzeF'), tg); mesh(new THREE.SphereGeometry(0.010, 16, 12), mat('bronze', {}, 'bronzeF'), tg, [0, -0.058, 0]); g.scale.setScalar(s); scene.add(g); return { g, set(a, b = a) { sw.rotation.z = a; tg.rotation.z = b - a; } };
}
// still or ringed water in a vessel: rings(t) set through uniforms
export function waterDisc(scene, p, R, { amp = 0.004 } = {}) {
  const g = new THREE.CircleGeometry(R, 96); g.rotateX(-Math.PI / 2); const m = M('water', { u: { uAmp: amp, uT0: 0, uLit: 0 }, env: 1.4, bump: 1, surf: `float r = length(p.xz); float w = 0.; for (int i = 0; i < 4; i++) { float fi = float(i); vec2 o = vec2(sin(fi * 2.1), cos(fi * 3.3)) * .35 * ${R.toFixed(3)} * step(.5, fi); float d = length(p.xz - o); w += sin(d * (150. - 18. * fi) - uTime * (9. + fi)) * exp(-d * 4.) ; } h = uAmp * w * .5; emit = vec3(1., .82, .5) * uLit * .35 * exp(-r * r * 60.); metal = .72; alb = vec3(.52, .56, .60); rough = .02;` }); const o = mesh(g, m, scene, p); o.castShadow = false; return { mesh: o, m, set(a, lit = 0) { m.userData.u.uAmp.value = a; m.userData.u.uLit.value = lit; } };
}
export function bag(scene, p, { s = 1, seed = 1, rot = 0, mt = 'leather' } = {}) { const o = new THREE.Group(); o.position.set(...p); o.scale.setScalar(s); o.rotation.y = rot; const g = new THREE.SphereGeometry(1, 120, 90), q = g.attributes.position; for (let i = 0; i < q.count; i++) { let x = q.getX(i), y = q.getY(i), z = q.getZ(i); const a = Math.atan2(z, x), neck = smooth(0.35, 0.86, y), top = smooth(0.86, 1, y), n = fbm3(x * 1.6 + seed, y * 1.6, z * 1.6, 3) - 0.5; let f = 1 + n * 0.22 - neck * 0.66 + top * 0.50; f *= 1 + 0.10 * neck * Math.sin(a * 11 + seed) + 0.03 * smooth(-0.2, 0.4, y) * Math.sin(a * 11 + seed); x *= f * 0.2; z *= f * 0.185; y = y < -0.55 ? -0.55 + (y + 0.55) * 0.12 : y; y = (y + 0.60) * 0.19 + top * 0.03; const r0 = y < 0.1 ? 1 + 0.12 * Math.sin(y * 30) * 0 : 1; q.setXYZ(i, x * r0, y, z * r0); } g.computeVertexNormals(); mesh(g, mat(mt, { uvless: true, surf: 'alb *= .85 + .3 * smoothstep(.02, .2, p.y);' }, mt + 'bag'), o); const ring = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * 2 * Math.PI; ring.push(V(Math.cos(a) * 0.082, 0.262 + 0.006 * Math.sin(a * 2), Math.sin(a) * 0.076)); } mesh(sweep(ring, 0.008, { S: 7, cap: false }), flaxMat(), o); scene.add(o); return o; }
export { V, COL };
