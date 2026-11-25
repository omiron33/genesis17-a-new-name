// Cloth as a real sheet of points and links, simulated at a fixed step from before the scene starts,
// so frame t depends only on t. Pins can move and let go; it falls on the ground, on spheres and bars.
import * as THREE from 'three';
import { M } from '/song/lib/core.js';
import { fractal } from '/kit/motion.js';
const DT = 1 / 120;
// cfg: w, h, nx, ny, t0; rest(u, v) -> [x,y,z] starting shape; pin(i, j) -> null | (t) => [x,y,z] | null to let go
// wind(t) -> [x,y,z]; ground(x,z) -> y; balls: (t) => [[x,y,z,r], ...]; iter; aero; damp
export function sheet(cfg) {
  const { w, h, nx = 30, ny = 30, t0 } = cfg, N = nx * ny, ITER = cfg.iter ?? 14, id = (i, j) => j * nx + i, sx = w / (nx - 1), sy = h / (ny - 1);
  const P = new Float64Array(N * 3), Q = new Float64Array(N * 3), V = new Float64Array(N * 3);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const p = cfg.rest(i / (nx - 1), j / (ny - 1)), o = id(i, j) * 3; P[o] = Q[o] = p[0]; P[o + 1] = Q[o + 1] = p[1]; P[o + 2] = Q[o + 2] = p[2]; }
  const A = [], B = [], L = [], K = []; const link = (a, b, l, k) => { A.push(a * 3); B.push(b * 3); L.push(l); K.push(k * 0.5); };
  const sh = cfg.shear ?? 0.3, bd = cfg.bend ?? 0.07;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (i + 1 < nx) link(id(i, j), id(i + 1, j), sx, 1); if (j + 1 < ny) link(id(i, j), id(i, j + 1), sy, 1);
    const d = Math.hypot(sx, sy); if (i + 1 < nx && j + 1 < ny) { link(id(i, j), id(i + 1, j + 1), d, sh); link(id(i + 1, j), id(i, j + 1), d, sh); }
    if (i + 2 < nx) link(id(i, j), id(i + 2, j), sx * 2, bd); if (j + 2 < ny) link(id(i, j), id(i, j + 2), sy * 2, bd);
    if (cfg.stiff && i + 4 < nx) link(id(i, j), id(i + 4, j), sx * 4, cfg.stiff); if (cfg.stiff && j + 4 < ny) link(id(i, j), id(i, j + 4), sy * 4, cfg.stiff);
  }
  const pins = []; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const f = cfg.pin?.(i, j, nx, ny); if (f) pins.push([id(i, j) * 3, f]); }
  const n = A.length, seed = cfg.seed ?? 1, turb = cfg.turb ?? 0.4, aero = cfg.aero ?? 2.6, damp = cfg.damp ?? 0.9982, fric = cfg.fric ?? 0.5;
  const states = [Float32Array.from(P)];
  function step(t) {
    const wd = cfg.wind(t), wl = Math.hypot(...wd);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const o = id(i, j) * 3, l = id(Math.max(i - 1, 0), j) * 3, r = id(Math.min(i + 1, nx - 1), j) * 3, up = id(i, Math.max(j - 1, 0)) * 3, dn = id(i, Math.min(j + 1, ny - 1)) * 3;
      const ax = P[r] - P[l], ay = P[r + 1] - P[l + 1], az = P[r + 2] - P[l + 2], bx = P[dn] - P[up], by = P[dn + 1] - P[up + 1], bz = P[dn + 2] - P[up + 2];
      let x = ay * bz - az * by, y = az * bx - ax * bz, z = ax * by - ay * bx; const q = Math.hypot(x, y, z) || 1; x /= q; y /= q; z /= q;
      const ph = (P[o] * wd[0] + P[o + 2] * wd[2]) / (wl + 0.5), gg = 1 + turb * 1.5 * fractal((t - ph * 0.22) * 1.7, { seed: seed + 2, octaves: 2 }), s = turb * wl * 0.75 * fractal((t - ph * 0.3) * 2.5 + P[o + 1] * 0.8, { seed: seed + 5, octaves: 2 });
      const vx = (P[o] - Q[o]) / DT, vy = (P[o + 1] - Q[o + 1]) / DT, vz = (P[o + 2] - Q[o + 2]) / DT;
      const rx = wd[0] * gg - vx + x * s, ry = wd[1] * gg - vy, rz = wd[2] * gg - vz + z * s, f = (x * rx + y * ry + z * rz) * aero;
      V[o] = x * f + rx * 0.22; V[o + 1] = y * f + ry * 0.22 - 9.81 * (cfg.grav ?? 1); V[o + 2] = z * f + rz * 0.22;
    }
    for (let o = 0; o < N * 3; o++) { let v = (P[o] - Q[o]) * damp; if (v > 0.12) v = 0.12; else if (v < -0.12) v = -0.12; Q[o] = P[o]; P[o] += v + V[o] * DT * DT; }
    const H = []; for (const [o, f] of pins) { const p = f(t + DT); if (p) H.push(o, p[0], p[1], p[2]); }
    const balls = cfg.balls?.(t + DT);
    for (let k = 0; k < ITER; k++) {
      for (let q = 0; q < n; q++) { const a = A[q], b = B[q], dx = P[b] - P[a], dy = P[b + 1] - P[a + 1], dz = P[b + 2] - P[a + 2], d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6, c = (d - L[q]) / d * K[q]; P[a] += dx * c; P[a + 1] += dy * c; P[a + 2] += dz * c; P[b] -= dx * c; P[b + 1] -= dy * c; P[b + 2] -= dz * c; }
      for (let q = 0; q < H.length; q += 4) { P[H[q]] = H[q + 1]; P[H[q] + 1] = H[q + 2]; P[H[q] + 2] = H[q + 3]; }
      if (balls && (k & 3) === 3) for (const [x, y, z, r] of balls) for (let o = 0; o < N * 3; o += 3) { const dx = P[o] - x, dy = P[o + 1] - y, dz = P[o + 2] - z, d2 = dx * dx + dy * dy + dz * dz; if (d2 < r * r) { const d = Math.sqrt(d2) || 1e-6, c = (r - d) / d; P[o] += dx * c; P[o + 1] += dy * c; P[o + 2] += dz * c; Q[o] += (P[o] - Q[o]) * 0.25; Q[o + 1] += (P[o + 1] - Q[o + 1]) * 0.25; Q[o + 2] += (P[o + 2] - Q[o + 2]) * 0.25; } }
    }
    const G = cfg.ground; for (let o = 0; o < N * 3; o += 3) { const y = (G ? G(P[o], P[o + 2]) : 0) + 0.012; if (P[o + 1] < y) { P[o + 1] = y; Q[o] += (P[o] - Q[o]) * fric; Q[o + 2] += (P[o + 2] - Q[o + 2]) * fric; Q[o + 1] = y; } }
  }
  const at = (t) => { const x = Math.max(0, (t - t0) / DT), k = Math.floor(x); while (states.length < k + 2) { step(t0 + (states.length - 1) * DT); states.push(Float32Array.from(P)); } const a = states[k], b = states[k + 1], f = x - k, out = new Float32Array(N * 3); for (let o = 0; o < N * 3; o++) out[o] = a[o] + (b[o] - a[o]) * f; return out; };
  return { at, nx, ny, centre(t) { const s = at(t), c = [0, 0, 0]; for (let p = 0; p < N; p++) for (let k = 0; k < 3; k++) c[k] += s[p * 3 + k] / N; return c; }, point(t, i, j) { const s = at(t), o = id(i, j) * 3; return [s[o], s[o + 1], s[o + 2]]; } };
}
// hanging from a line a..b: top edge held in small gathers; `sag` of the line
export function hang(o) {
  const { a, b, h, t0 } = o, D = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), w = D * (o.gather ?? 1.3), nx = o.nx ?? 34, ny = o.ny ?? 34, n = [-(b[2] - a[2]) / D, 0, (b[0] - a[0]) / D], fold = o.fold ?? 0.07;
  const top = o.top ?? ((u) => a.map((v, k) => v + (b[k] - v) * u));
  const pinAt = (u, t) => { const p = top(u, t), z = fold * Math.sin(u * Math.PI * (o.folds ?? 9) + 0.6) * (0.7 + 0.5 * Math.sin(u * 17 + (o.seed ?? 1))); return [p[0] + n[0] * z, p[1] - (o.sag ?? 0.03) * 4 * u * (1 - u), p[2] + n[2] * z]; };
  return sheet({ ...o, w, h, nx, ny, t0: t0, rest: (u, v) => { const p = pinAt(u, t0); return [p[0], p[1] - v * h, p[2]]; }, pin: (i, j) => { if (j !== 0) return o.hold?.(i, j, nx, ny) ?? null; const u = i / (nx - 1), rel = o.release?.(u) ?? 1e9; return (t) => (t < rel ? pinAt(u, t) : null); } });
}
// a mesh that follows a sheet. v = 0 at the top edge
export function clothMesh(scene, S, mat, { sub = 2 } = {}) {
  const nx = S.nx, ny = S.ny, mx = (nx - 1) * sub + 1, my = (ny - 1) * sub + 1, g = new THREE.BufferGeometry(), pos = new Float32Array(mx * my * 3), uv = new Float32Array(mx * my * 2), idx = [];
  for (let j = 0; j < my; j++) for (let i = 0; i < mx; i++) { uv[(j * mx + i) * 2] = i / (mx - 1); uv[(j * mx + i) * 2 + 1] = 1 - j / (my - 1); if (i + 1 < mx && j + 1 < my) { const a = j * mx + i; idx.push(a, a + mx, a + 1, a + 1, a + mx, a + mx + 1); } }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; m.frustumCulled = false; scene.add(m); let last = null;
  const cat = (a, b, c, d, f) => 0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
  const tmp = new Float32Array(mx * ny * 3);
  return { mesh: m, set(t) {
    if (t === last) return; last = t; const s = S.at(t);
    for (let j = 0; j < ny; j++) for (let i = 0; i < mx; i++) { const q = i / sub, k = Math.min(nx - 2, Math.floor(q)), f = q - k, o = (c) => (j * nx + Math.min(nx - 1, Math.max(0, c))) * 3; for (let e = 0; e < 3; e++) tmp[(j * mx + i) * 3 + e] = cat(s[o(k - 1) + e], s[o(k) + e], s[o(k + 1) + e], s[o(k + 2) + e], f); }
    for (let j = 0; j < my; j++) { const q = j / sub, k = Math.min(ny - 2, Math.floor(q)), f = q - k, o = (c) => Math.min(ny - 1, Math.max(0, c)) * mx * 3; for (let i = 0; i < mx; i++) for (let e = 0; e < 3; e++) pos[(j * mx + i) * 3 + e] = cat(tmp[o(k - 1) + i * 3 + e], tmp[o(k) + i * 3 + e], tmp[o(k + 1) + i * 3 + e], tmp[o(k + 2) + i * 3 + e], f); }
    g.attributes.position.needsUpdate = true; g.computeVertexNormals(); g.attributes.normal.needsUpdate = true;
  } };
}
export const COL = { red: [0.46, 0.030, 0.022], indigo: [0.030, 0.050, 0.23], cream: [0.70, 0.62, 0.47], saffron: [0.80, 0.42, 0.06], brown: [0.22, 0.13, 0.07] };
export function woolMat(col, o = {}) { return M('wool', { side: THREE.DoubleSide, transl: o.transl ?? 0.5, sheen: 0.25, sheenColor: col.map((x) => Math.min(1, x * 1.4 + 0.05)), u: { uCol: col, uThreads: o.threads ?? 190 }, border: o.border }); }
