// Trees grown, not modelled: limbs placed by hand, the rest by space colonisation, girth by the pipe
// rule, leaves as tens of thousands of sprigs that answer the wind.
import * as THREE from 'three';
import { M } from '/song/lib/core.js';
import { rng, fbm3, n3, smooth, lerp } from '/song/lib/noise.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
// nodes: { p, parent, r, kids }
export function grow({ trunk, crown, n = 1300, step = 0.34, reach = 2.6, kill = 0.62, seed = 1, up = 0.04, iters = 90, tip = 0.011, pipe = 2.35 }) {
  const rnd = rng(seed), nodes = [];
  const add = (p, parent) => { nodes.push({ p, parent, kids: 0, d: null }); if (parent >= 0) nodes[parent].kids++; return nodes.length - 1; };
  const heads = trunk(add, V, rnd);
  let pts = []; while (pts.length < n) { const p = crown(rnd, V); if (p) pts.push(p); }
  const cellS = reach, grid = new Map(), key = (p) => `${Math.floor(p.x / cellS)},${Math.floor(p.y / cellS)},${Math.floor(p.z / cellS)}`;
  const ins = (i) => { const k = key(nodes[i].p); (grid.get(k) ?? grid.set(k, []).get(k)).push(i); };
  for (let i = 0; i < nodes.length; i++) if (!heads || i >= heads) ins(i);
  for (let it = 0; it < iters; it++) {
    const pull = new Map(); const rest = [];
    for (const a of pts) {
      let best = -1, bd = reach * reach; const cx = Math.floor(a.x / cellS), cy = Math.floor(a.y / cellS), cz = Math.floor(a.z / cellS);
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) for (const i of grid.get(`${cx + x},${cy + y},${cz + z}`) ?? []) { const d = nodes[i].p.distanceToSquared(a); if (d < bd) { bd = d; best = i; } }
      if (best >= 0) { if (bd < kill * kill) continue; const d = V().subVectors(a, nodes[best].p).normalize(); (pull.get(best) ?? pull.set(best, V(0, 0, 0)).get(best)).add(d); }
      rest.push(a);
    }
    pts = rest; if (!pull.size) break; let grew = 0;
    for (const [i, d] of pull) { if (nodes[i].kids > 2) continue; d.normalize().add(V((rnd() - 0.5) * 0.35, (rnd() - 0.5) * 0.35 + up, (rnd() - 0.5) * 0.35)).normalize(); const p = nodes[i].p.clone().addScaledVector(d, step); ins(add(p, i)); grew++; }
    if (!grew) break;
  }
  for (const nd of nodes) nd.r = 0;
  for (let i = nodes.length - 1; i >= 0; i--) { const nd = nodes[i]; nd.r = nd.kids ? Math.pow(nd.r, 1 / pipe) : tip; if (nd.parent >= 0) nodes[nd.parent].r += Math.pow(nd.r, pipe); }
  return nodes;
}
// tubes along the branches
export function branches(nodes, { minR = 0.010, flare = 0, seg = (r) => (r > 0.18 ? 22 : r > 0.06 ? 11 : 5), rough = 0 } = {}) {
  const kids = nodes.map(() => []); nodes.forEach((n, i) => { if (n.parent >= 0) kids[n.parent].push(i); });
  const P = [], N = [], uv = [], I = []; const starts = [0];
  while (starts.length) {
    let s = starts.pop(); const chain = []; if (nodes[s].parent >= 0) chain.push({ p: nodes[nodes[s].parent].p, r: Math.min(nodes[s].r * 1.15, nodes[nodes[s].parent].r) });
    let c = s; for (;;) { chain.push({ p: nodes[c].p, r: nodes[c].r }); const k = kids[c].sort((a, b) => nodes[b].r - nodes[a].r); if (!k.length) break; for (let q = 1; q < k.length; q++) starts.push(k[q]); c = k[0]; }
    if (chain.length < 2 || chain[1].r < minR) continue;
    const curve = new THREE.CatmullRomCurve3(chain.map((x) => x.p), false, 'centripetal'); const big = chain[1].r, S = seg(big), L = Math.max(2, Math.round((chain.length - 1) * (big > 0.15 ? 3 : 1.4)));
    const fr = curve.computeFrenetFrames(L, false), base = P.length / 3; let len = 0, prev = null;
    for (let i = 0; i <= L; i++) {
      const u = i / L, f = u * (chain.length - 1), j = Math.min(chain.length - 2, Math.floor(f)), r0 = lerp(chain[j].r, chain[j + 1].r, f - j), p = curve.getPointAt ? curve.getPoint(u) : null; if (prev) len += p.distanceTo(prev); prev = p;
      for (let k = 0; k <= S; k++) { const a = k / S * 2 * Math.PI; const d = V().addScaledVector(fr.normals[i], Math.cos(a)).addScaledVector(fr.binormals[i], Math.sin(a)); let r = r0;
        if (big > 0.12) r *= 1 + 0.16 * (n3(d.x * 1.8 + p.x, p.y * 0.8, d.z * 1.8 + p.z) - 0.5) * 2 + 0.08 * Math.sin(a * 5 + p.y * 0.7) ;
        if (flare && p.y < flare) { const q = 1 - Math.max(0, p.y) / flare; r *= 1 + 0.75 * q * q + 0.32 * q * Math.max(0, Math.sin(a * 5 + 1)); }
        P.push(p.x + d.x * r, p.y + d.y * r, p.z + d.z * r); N.push(d.x, d.y, d.z); uv.push(k / S, len); }
    }
    for (let i = 0; i < L; i++) for (let k = 0; k < S; k++) { const a = base + i * (S + 1) + k, b = a + S + 1; I.push(a, a + 1, b, b, a + 1, b + 1); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I); return g;
}
// a sprig of k leaves
export function sprigGeo(k = 5, { L = 0.10, W = 0.045, spread = 1.0, curl = 0.25 } = {}) {
  const P = [], N = [], uv = [], I = [];
  for (let i = 0; i < k; i++) { const a = i * 2.4, t = i / k, dir = V(Math.cos(a) * spread, 0.55 + 0.5 * t, Math.sin(a) * spread).normalize(), side = V(-Math.sin(a), 0, Math.cos(a)), n = V().crossVectors(side, dir).normalize(); const o = V(0, t * L * 0.9, 0), b = P.length / 3;
    const mid = o.clone().addScaledVector(dir, L * 0.5), tipP = o.clone().addScaledVector(dir, L).addScaledVector(n, -L * curl);
    const q = [o, mid.clone().addScaledVector(side, W).addScaledVector(n, 0.012), tipP, mid.clone().addScaledVector(side, -W).addScaledVector(n, 0.012)];
    q.forEach((v, j) => { P.push(v.x, v.y, v.z); const m = n.clone().addScaledVector(side, [0, 0.35, 0, -0.35][j]).add(V(0, 0.25, 0)).normalize(); N.push(m.x, m.y, m.z); }); uv.push(0.5, 0, 0, 0.5, 0.5, 1, 1, 0.5); I.push(b, b + 1, b + 2, b, b + 2, b + 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I); return g;
}
export function leafMat(o = {}) {
  return M('leaf', { side: THREE.DoubleSide, transl: o.transl ?? 1.0, u: { uColA: o.colA ?? [0.075, 0.115, 0.028], uColB: o.colB ?? [0.185, 0.225, 0.060], uFlutter: o.flutter ?? 1, uShow: 1, ...(o.u ?? {}) }, vertHead: ' ', surf: o.surf,
    vert: `{ vec4 wp = instanceMatrix * vec4(0., 0., 0., 1.); float gw = vn(vec2(wp.x, wp.z) * .16 - uWind.xz * uTime * .4 + wp.y * .1); float ph = vIH * 6.28; float sway = uGust * (.04 + .16 * gw); transformed *= ${o.show ?? '1.'}; transformed += inverse(mat3(instanceMatrix)) * (uWind * sway * .55 + vec3(sin(uTime * 2.3 + ph), sin(uTime * 3.1 + ph * 2.), cos(uTime * 2.7 + ph)) * .018 * uFlutter * (.4 + uGust * gw * 1.6)); }` });
}
export function leafSpots(nodes, { maxR = 0.035, per = 3, jitter = 0.16, seed = 4, size = [0.7, 1.4], keep } = {}) {
  const r = rng(seed), out = []; const q = new THREE.Quaternion();
  for (const n of nodes) { if (n.r > maxR || n.parent < 0) continue; if (keep && !keep(n.p, r)) continue; for (let i = 0; i < per; i++) { const s = lerp(size[0], size[1], r()); out.push({ p: [n.p.x + (r() - 0.5) * jitter * 2, n.p.y + (r() - 0.5) * jitter * 2, n.p.z + (r() - 0.5) * jitter * 2], s, r: [(r() - 0.5) * 2.2, r() * 6.283, (r() - 0.5) * 2.2] }); } }
  return out;
}
// the oak of Mambre: short, immense, spreading low
let OAK = null;
export function oakNodes() {
  if (OAK) return OAK;
  OAK = grow({ seed: 12, n: 3600, step: 0.36, reach: 2.5, kill: 0.60, up: 0.02, tip: 0.0150, pipe: 2.02, iters: 70,
    trunk: (add, V, rnd) => {
      let a = -1; const lean = [[0, -0.5, 0], [0, 0, 0], [0.04, 0.5, 0.02], [0.10, 1.05, 0.0], [0.12, 1.6, -0.05], [0.05, 2.1, -0.04]]; for (const p of lean) a = add(V(...p), a); const top = a, limbs = [[[1.1, 2.75, 0.25], [2.4, 3.15, 0.7], [3.9, 3.35, 1.0], [5.3, 3.9, 0.9]], [[-0.8, 2.8, 0.5], [-2.0, 3.4, 1.3], [-3.4, 3.7, 2.2], [-4.6, 4.2, 2.4]], [[-0.7, 2.9, -0.7], [-1.9, 3.8, -1.7], [-3.4, 4.4, -2.6]], [[0.6, 3.0, -0.9], [1.3, 4.0, -2.1], [2.3, 4.7, -3.4]], [[0.1, 3.1, 0.35], [0.4, 4.3, 0.9], [0.2, 5.6, 1.1], [0.5, 6.7, 1.0]], [[0.3, 2.6, 0.9], [0.8, 3.0, 2.2], [1.5, 3.5, 3.7]]];
      for (const L of limbs) { let c = top, prev = new THREE.Vector3(0.05, 2.1, -0.04); for (const q of L) { const t = V(...q), n = Math.max(1, Math.round(prev.distanceTo(t) / 0.45)); for (let i = 1; i <= n; i++) { const p = prev.clone().lerp(t, i / n); p.y += 0.12 * Math.sin(i * 1.7 + q[0]); p.x += 0.07 * Math.sin(i * 2.3 + q[2]); p.z += 0.07 * Math.cos(i * 1.9 + q[0]); c = add(p, c); } prev = t; } }
      return 12;
    },
    crown: (r, V) => { const p = V((r() * 2 - 1) * 8.6, 2.4 + r() * 7.2, (r() * 2 - 1) * 8.0), e = Math.hypot(p.x / 8.4, (p.y - 4.3) / (p.y > 4.3 ? 4.9 : 2.2), p.z / 7.6), lump = 0.82 + 0.36 * n3(p.x * 0.35 + 5, p.y * 0.35, p.z * 0.35); return e < lump && e > 0.35 && !(p.y < 3.2 && Math.hypot(p.x, p.z) < 3) ? p : null; } });
  return OAK;
}
export function oak(scene, o = {}) {
  const g = new THREE.Group(); const nodes = oakNodes();
  const trunk = new THREE.Mesh(branches(nodes, { minR: 0.0150, flare: 1.1 }), M('bark')); trunk.castShadow = trunk.receiveShadow = true; g.add(trunk);
  const spots = leafSpots(nodes, { maxR: 0.030, per: o.per ?? 15, jitter: 0.30, size: [0.7, 1.35], keep: o.keep }); const mat = leafMat(o.leaf ?? {});
  const im = new THREE.InstancedMesh(sprigGeo(5, { L: 0.092, W: 0.030 }), mat, spots.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(); spots.forEach((s, i) => { q.setFromEuler(new THREE.Euler(...s.r)); m.compose(new THREE.Vector3(...s.p), q, new THREE.Vector3(s.s, s.s, s.s)); im.setMatrixAt(i, m); });
  im.castShadow = im.receiveShadow = true; im.frustumCulled = false; g.add(im); g.position.set(...(o.at ?? [0, -0.05, 0])); if (o.rot) g.rotation.y = o.rot; scene.add(g);
  return { group: g, leaves: im, mat, count: spots.length, nodes: nodes.length };
}
