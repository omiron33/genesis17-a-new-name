// The hill of Mambre, near Hebron: a grassy knoll in terraced limestone country, spring grass, flowers,
// stones, scrub, and ridge after ridge beyond. Heights in metres, the oak near the origin.
import * as THREE from 'three';
import { M, U } from '/song/lib/core.js';
import { rng, fbm2, n2, smooth, clamp, lerp, fbm3 } from '/song/lib/noise.js';

export function height(x, z) {
  const r = Math.hypot(x, z);
  let h = (fbm2(x * 0.35, z * 0.35, 3) - 0.5) * 0.16 * smooth(1, 6, r) + (fbm2(x * 1.7 + 9, z * 1.7, 2) - 0.5) * 0.05;
  if (r > 13) {
    let g = smooth(13, 75, r) * ((fbm2(x * 0.011 + 3.3, z * 0.011 + 8.1, 4) - 0.5) * 30 - 7);
    const far = smooth(90, 800, r) * (Math.pow(fbm2(x * 0.0021 + 1.7, z * 0.0021 + 5.2, 5), 1.5) * 300 - 62) + smooth(900, 3200, r) * 90 * n2(x * 0.0009 + 4, z * 0.0009);
    g += far;
    if (r > 40) { const st = 2.4, q = g / st, t = (Math.floor(q) + smooth(0.62, 1.0, q - Math.floor(q))) * st; g = lerp(g, t, 0.75 * smooth(40, 70, r) * (1 - smooth(500, 900, r)) * smooth(0.35, 0.55, n2(x * 0.006, z * 0.006))); }
    h += g;
  }
  return h;
}
// bare ground: trodden places, as [x, z, radius] spots and [x0, z0, x1, z1, width] paths
export function bareField(spots = [], paths = []) {
  return (x, z) => {
    let b = smooth(0.60, 0.78, fbm2(x * 0.5 + 40, z * 0.5, 3)) * 0.8;
    const w = (fbm2(x * 1.1, z * 1.1 + 7, 3) - 0.5) * 1.1;
    for (const [a, c, r] of spots) b = Math.max(b, 1 - smooth(r * 0.75, r * 1.2, Math.hypot(x - a, z - c) + w * Math.min(1, r * 0.4)));
    for (const [x0, z0, x1, z1, wd] of paths) { const dx = x1 - x0, dz = z1 - z0, k = clamp(((x - x0) * dx + (z - z0) * dz) / (dx * dx + dz * dz)); const d = Math.hypot(x - x0 - dx * k, z - z0 - dz * k); b = Math.max(b, 0.95 * (1 - smooth(wd * 0.5, wd, d + w * 0.35))); }
    return b;
  };
}
const GROUND = `
  float hgt = p.y; float rr = length(p.xz); vec2 w = p.xz;
  float bare = texture(uBare, w / 96. + .5).r; if (max(abs(w.x), abs(w.y)) > 47.5) bare = .25;
  float f = fb(w * .9), g = fb(w * 5.), m = fb(w * .13 + 4.), k = vn(w * 60.);
  vec3 soil = mix(vec3(.235, .145, .085), vec3(.40, .275, .17), f) * (.66 + .6 * g); soil = mix(soil, vec3(.45, .37, .28), smoothstep(.52, .8, fb(w * 2.1 + 31.)) * .45); soil *= .82 + .30 * fb(w * 17.); { float cr = cell2(w * 2.6 + .5 * fb(w * 3.)).x; soil *= 1. - .10 * smoothstep(.2, .5, cr); }
  vec3 c2 = vec3(0.); float stone = 0.; if (px < .05) { vec3 c = cell2(w * 6.5 + .35 * vn(w * 9.)).xyz; float sz = .05 + .26 * fract(c.z * 13.) * fract(c.z * 13.); stone = smoothstep(sz, sz - .05, c.x) * step(.72, c.z) * smoothstep(.04, .01, px) * smoothstep(.40, .55, vn(w * .8)); c2 = mix(vec3(.24, .18, .13), vec3(.38, .32, .25), fract(c.z * 7.)) * (.75 + .5 * g); h += .016 * stone * (1. - c.x / sz);
    vec3 d = cell2(w * 34.).xyz; float s2 = smoothstep(.34, .22, d.x) * step(.72, d.z) * smoothstep(.016, .004, px); soil = mix(soil, vec3(.36, .28, .20) * (.45 + .75 * fract(d.z * 9.)), s2 * .45); h += .004 * s2; }
  soil = mix(soil, c2, stone * .85);
  vec3 green = mix(vec3(.10, .135, .03), vec3(.22, .235, .07), g), dry = mix(vec3(.30, .25, .11), vec3(.47, .39, .19), g);
  vec3 turf = mix(green, dry, smoothstep(.40, .62, m + .25 * (f - .5))) * (.62 + .5 * k);
  float slope = 1. - n.y; float far = smoothstep(26., 70., rr);
  alb = mix(turf, soil, clamp(bare * (1. - far) + far * smoothstep(.42, .7, fb(w * .08 + 2.)) * .7, 0., 1.));
  if (far > 0.) {
    float q = hgt / 2.4, fr = fract(q); float wall = smoothstep(.56, .64, fr) * smoothstep(1.02, .94, fr) * smoothstep(40., 70., rr) * (1. - smoothstep(400., 900., rr)) * smoothstep(.35, .55, vn(w * .006));
    vec3 rock = mix(vec3(.42, .37, .30), vec3(.62, .56, .46), fb(w * .7)) * (.7 + .5 * vn(vec2(w.x * 3. + w.y * 3., hgt * 9.)));
    alb = mix(alb, rock, clamp(smoothstep(.10, .34, slope) * far + wall * .55 * smoothstep(1.2, .3, px), 0., 1.));
    float sc = smoothstep(.50, .62, vn(w * .06 + 20.)); vec3 b = cell2(w * .16); float bush = smoothstep(.42, .24, b.x) * step(.25, b.z) * sc * smoothstep(60., 130., rr); alb = mix(alb, vec3(.062, .075, .032) * (.7 + .7 * b.z), bush * .85);
    vec3 tint = mix(vec3(1.), vec3(1.08, .98, .82), smoothstep(.4, .6, vn(w * .0018))); alb *= tint;
  }
  rough = .96; h += (.030 * f + .012 * g + .003 * k) * smoothstep(.12, .01, px);`;
export function land(scene, o = {}) {
  const c = o.center ?? [0, 0], bare = o.bare ?? bareField();
  const NR = o.nr ?? 230, NA = o.na ?? 360, rMax = o.rMax ?? 3600, pos = [], idx = [];
  const rad = (i) => { const k = i / NR; return 26 * k * 2.2 * (k < 0.42 ? 1 : 1) + rMax * Math.pow(k, 7); };
  pos.push(c[0], height(...c), c[1]);
  for (let i = 1; i <= NR; i++) for (let j = 0; j < NA; j++) { const a = j / NA * 2 * Math.PI + (i % 2) * Math.PI / NA, r = rad(i), x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r; pos.push(x, height(x, z), z); }
  for (let j = 0; j < NA; j++) idx.push(0, 1 + (j + 1) % NA, 1 + j);
  for (let i = 1; i < NR; i++) for (let j = 0; j < NA; j++) { const a = 1 + (i - 1) * NA + j, b = 1 + (i - 1) * NA + (j + 1) % NA, d = a + NA, e = b + NA; idx.push(a, b, d, b, e, d); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(pos.length / 3 * 2), 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const N = 384, D = new Uint8Array(N * N * 4); for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const b = bare((i + 0.5) / N * 96 - 48, (j + 0.5) / N * 96 - 48); D.fill(clamp(b) * 255, (j * N + i) * 4, (j * N + i) * 4 + 4); }
  const tex = new THREE.DataTexture(D, N, N); tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true;
  const mat = M('plain', { surf: GROUND + (o.surf ?? ''), u: { uBare: tex, ...(o.u ?? {}) }, fragHead: o.fragHead, bump: 1 });
  const mesh = new THREE.Mesh(geo, mat); mesh.receiveShadow = true; mesh.castShadow = o.cast ?? true; mesh.frustumCulled = false; scene.add(mesh);
  return { mesh, bare, mat };
}
const WIND = `
float gw = vn(vec2(wp.x, wp.z) * .22 - uWind.xz * uTime * .55) ; float gq = vn(vec2(wp.x, wp.z) * 1.3 - uWind.xz * uTime * 1.3 + 9.);
float push = uGust * (.25 + 1.15 * gw * gw + .25 * gq);`;
// spring grass: blades by the tens of thousands round `at`, not on bare ground, leaning in the wind
export function grass(scene, o) {
  const R = o.r ?? 12, n = o.n ?? 60000, at = o.at, bare = o.bare, rnd = rng(o.seed ?? 5), inner = o.inner ?? 0;
  const g = new THREE.BufferGeometry(), P = [], uv = [], N = [], I = [], S = 4;
  for (let i = 0; i <= S; i++) { const k = i / S, w = 0.5 * (1 - k * k * 0.96), y = k; const cx = 0.16 * k * k; P.push(-w, y, cx, w, y, cx); uv.push(0, k, 1, k); N.push(-0.35, 0.8, 0.5, 0.35, 0.8, 0.5); if (i) { const b = i * 2; I.push(b - 2, b - 1, b, b - 1, b + 1, b); } }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I);
  const mats = [], cols = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let tries = 0;
  while (mats.length < n && tries++ < n * 4) {
    const a = rnd() * 2 * Math.PI, rr = inner + (R - inner) * Math.sqrt(rnd()) * (rnd() < 0.5 ? rnd() * 0.5 + 0.5 : 1); const x = at[0] + Math.cos(a) * rr, z = at[1] + Math.sin(a) * rr;
    const b = bare(x, z); if (rnd() < b * 1.25) continue; if (o.keep && !o.keep(x, z)) continue;
    const pat = fbm2(x * 0.33 + 20, z * 0.33, 3), tall = (0.10 + 0.26 * Math.pow(fbm2(x * 0.8, z * 0.8 + 33, 2), 1.3) * 1.5) * (0.55 + 0.75 * rnd()) * (1 - 0.55 * b) * (o.tall ?? 1);
    e.set((rnd() - 0.5) * 0.5, rnd() * 6.283, (rnd() - 0.5) * 0.5); q.setFromEuler(e); s.set(0.006 + 0.007 * rnd(), tall, tall * (0.6 + rnd())); p.set(x, height(x, z) - 0.01, z); m.compose(p, q, s); mats.push(m.clone());
    const d = clamp((pat - 0.42) * 3.2 + (rnd() - 0.5) * 0.5 + (o.dry ?? 0)), v = 0.7 + 0.6 * rnd(); cols.push(lerp(0.115, 0.50, d) * v, lerp(0.185, 0.42, d) * v, lerp(0.035, 0.17, d) * v);
  }
  const mat2 = M('plain', { side: THREE.DoubleSide, transl: 0.9, surf: 'alb *= .35 + .85 * uv.y; rough = .62;', vertHead: ' ', vert: `{ vec4 wp = instanceMatrix * vec4(0., 0., 0., 1.); ${WIND} float k = position.y; vec3 off = uWind * push * k * k * length(instanceMatrix[1].xyz) * 1.15; transformed += inverse(mat3(instanceMatrix)) * vec3(off.x, -.35 * length(off) * k, off.z); }` });
  const im = new THREE.InstancedMesh(g, mat2, mats.length); mats.forEach((x, i) => im.setMatrixAt(i, x)); im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cols), 3); im.receiveShadow = true; im.castShadow = !!o.cast; im.frustumCulled = false; scene.add(im);
  return im;
}
// wild flowers: anemones, daisies, mustard
export function flowers(scene, o) {
  const rnd = rng(o.seed ?? 8), P = [], N = [], uv = [], I = [];
  const pet = o.petals ?? 6;
  for (let k = 0; k < pet; k++) { const a = k / pet * 6.283, b = P.length / 3; const d = (r, da, y) => P.push(Math.cos(a + da) * r, 1 + y, Math.sin(a + da) * r); d(0.12, 0, 0); d(0.80, -0.50, 0.045); d(1.0, 0, 0.03); d(0.80, 0.50, 0.045); for (let q = 0; q < 4; q++) N.push(0, 1, 0); uv.push(0.5, 0, 0, 0.7, 0.5, 1, 1, 0.7); I.push(b, b + 1, b + 2, b, b + 2, b + 3); }
  { const b = P.length / 3; for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283; P.push(Math.cos(a) * 0.2, 1.06, Math.sin(a) * 0.2); N.push(0, 1, 0); uv.push(-1, -1); } for (let k = 1; k < 6; k++) I.push(b, b + k + 1, b + k); }
  { const b = P.length / 3; for (const [x, y] of [[-0.03, 0], [0.03, 0], [0.03, 1], [-0.03, 1]]) { P.push(x, y * 1.0, 0); N.push(0, 0.6, 0.8); uv.push(-2, -2); } I.push(b, b + 1, b + 2, b, b + 2, b + 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I);
  const mat = M('plain', { side: THREE.DoubleSide, transl: 0.8, surf: 'if (uv.x < -1.5) alb = vec3(.12, .18, .05); else if (uv.x < -.5) alb = vec3(.055, .05, .02); else alb *= .75 + .35 * uv.y; rough = .6;', vertHead: ' ', vert: `{ vec4 wp = instanceMatrix * vec4(0., 0., 0., 1.); ${WIND} float k = position.y; vec3 off = uWind * push * k * k * .10; transformed += inverse(mat3(instanceMatrix)) * vec3(off.x, -.1 * length(off), off.z); }` });
  const list = []; let tries = 0; const COL = o.colors ?? [[0.70, 0.03, 0.025], [0.70, 0.03, 0.025], [0.85, 0.80, 0.70], [0.85, 0.58, 0.05], [0.42, 0.16, 0.55]];
  while (list.length < (o.n ?? 400) && tries++ < 20000) { const a = rnd() * 6.283, rr = (o.r ?? 10) * Math.sqrt(rnd()), x = o.at[0] + Math.cos(a) * rr, z = o.at[1] + Math.sin(a) * rr; if (o.bare(x, z) > 0.3 || fbm2(x * 0.45 + 70, z * 0.45, 2) < 0.47) continue; list.push([x, z]); }
  const im = new THREE.InstancedMesh(g, mat, list.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(); const cols = [];
  list.forEach(([x, z], i) => { const s = 0.018 + 0.016 * rnd(), hh = 0.14 + 0.16 * rnd(); q.setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.5, rnd() * 6.283, (rnd() - 0.5) * 0.5)); m.compose(new THREE.Vector3(x, height(x, z), z), q, new THREE.Vector3(s, hh, s)); im.setMatrixAt(i, m); const c = COL[Math.floor(n2(x * 0.6, z * 0.6 + 50) * 0.999 * COL.length + rnd() * 0.6) % COL.length], v = 0.8 + 0.4 * rnd(); cols.push(c[0] * v, c[1] * v, c[2] * v); });
  im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(cols), 3); im.receiveShadow = true; im.castShadow = true; im.frustumCulled = false; scene.add(im); return im;
}
export function rockGeo(seed, detail = 5, flat = 0.72) {
  const g0 = new THREE.IcosahedronGeometry(1, detail * 4), p = g0.attributes.position, r = rng(seed); const ox = r() * 50, oy = r() * 50;
  const cuts = [...Array(14)].map(() => { const v = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(); return [v, 0.66 + 0.26 * r()]; });
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); let d = 1; for (const [c, k] of cuts) { const q = v.dot(c); if (q > 0) d = Math.min(d, lerp(d, k / Math.max(q, 1e-3), 0.97)); } d *= 1 + 0.20 * (fbm3(v.x * 1.6 + ox, v.y * 1.6 + oy, v.z * 1.6, 4) - 0.5) + 0.07 * (fbm3(v.x * 7 + ox, v.y * 7, v.z * 7 + oy, 3) - 0.5); v.multiplyScalar(d); p.setXYZ(i, v.x, v.y * flat, v.z); }
  g0.computeVertexNormals(); const n = g0.attributes.normal;   // icosahedron is unindexed: smooth normals by position
  const map = new Map(); for (let i = 0; i < p.count; i++) { const k = `${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`; const a = map.get(k) ?? [0, 0, 0]; a[0] += n.getX(i); a[1] += n.getY(i); a[2] += n.getZ(i); map.set(k, a); }
  for (let i = 0; i < p.count; i++) { const a = map.get(`${p.getX(i).toFixed(4)},${p.getY(i).toFixed(4)},${p.getZ(i).toFixed(4)}`), l = Math.hypot(...a) || 1; n.setXYZ(i, a[0] / l, a[1] / l, a[2] / l); }
  return g0;
}
// put instances of a geometry: list of { p:[x,y,z], s, r:[x,y,z] }
export function instances(scene, geo, mat, list, { cast = true } = {}) {
  const im = new THREE.InstancedMesh(geo, mat, Math.max(1, list.length)), m = new THREE.Matrix4(), q = new THREE.Quaternion();
  list.forEach((o, i) => { q.setFromEuler(new THREE.Euler(...(o.r ?? [0, 0, 0]))); const s = o.s ?? 1; m.compose(new THREE.Vector3(...o.p), q, Array.isArray(s) ? new THREE.Vector3(...s) : new THREE.Vector3(s, s, s)); im.setMatrixAt(i, m); });
  if (list.some((o) => o.c)) { const c = new Float32Array(list.length * 3); list.forEach((o, i) => c.set(o.c ?? [1, 1, 1], i * 3)); im.instanceColor = new THREE.InstancedBufferAttribute(c, 3); }
  im.castShadow = cast; im.receiveShadow = true; im.frustumCulled = false; scene.add(im); return im;
}
// stones in families: a big one with smaller ones round it
export function stones(scene, o) {
  const rnd = rng(o.seed ?? 3), mat = M('limestone', { uvless: true }); const sets = [[], [], []];
  for (const [x, z, s, n] of o.at) {
    const put = (px, pz, ss, k) => sets[k % 3].push({ p: [px, height(px, pz) + ss * 0.16, pz], s: ss, r: [(rnd() - 0.5) * 0.4, rnd() * 6.28, (rnd() - 0.5) * 0.4] });
    put(x, z, s, Math.floor(rnd() * 3)); for (let i = 0; i < (n ?? 6); i++) { const a = rnd() * 6.283, d = s * (0.9 + 1.6 * rnd()); put(x + Math.cos(a) * d, z + Math.sin(a) * d, s * (0.08 + 0.3 * rnd() * rnd()), i); }
  }
  sets.forEach((l, i) => l.length && instances(scene, rockGeo(11 + i * 7, 4), mat, l));
}
// a leaf clump (shrub, or a distant tree's crown)
export function clumpGeo(seed, n, size, flat = 0.8) {
  const r = rng(seed), P = [], N = [], uv = [], I = [];
  for (let i = 0; i < n; i++) {
    const a = r() * 6.283, y = Math.pow(r(), 0.8) * 1.35 - 0.35, s = Math.sqrt(Math.max(0, 1 - y * y)), rad = 0.55 + 0.45 * Math.pow(r(), 0.4), lump = 0.8 + 0.4 * n2(Math.cos(a) * 2 + seed, y * 2 + Math.sin(a) * 2);
    const c = [Math.cos(a) * s * rad * lump, Math.max(0, (y + 0.35) * flat * rad * lump), Math.sin(a) * s * rad * lump];
    const d = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(), e = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).cross(d).normalize(), w = size * (0.6 + 0.8 * r()), b = P.length / 3, nn = new THREE.Vector3(c[0], c[1] * 0.8 + 0.15, c[2]).normalize();
    for (const [x, y2] of [[0, -1], [-0.5, 0], [0, 1], [0.5, 0]]) { P.push(c[0] + d.x * y2 * w + e.x * x * w, c[1] + d.y * y2 * w + e.y * x * w, c[2] + d.z * y2 * w + e.z * x * w); const q = new THREE.Vector3(nn.x + e.x * x, nn.y + e.y * x, nn.z + e.z * x).normalize(); N.push(q.x, q.y, q.z); uv.push(0.5 + x, 0.5 + y2 * 0.5); }
    I.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I); return g;
}
export function shrubs(scene, o) {
  const rnd = rng(o.seed ?? 21), mat = M('leaf', { side: THREE.DoubleSide, transl: 0.28, u: { uColA: o.colA ?? [0.065, 0.085, 0.030], uColB: o.colB ?? [0.14, 0.155, 0.065] }, surf: 'alb *= .6 + .5 * smoothstep(0., .8, p.y);' });
  const near = [], far = [];
  for (const [x, z, s] of o.at ?? []) near.push({ p: [x, height(x, z) - 0.03, z], s: [s, s * (0.75 + 0.4 * rnd()), s], r: [0, rnd() * 6.28, 0] });
  if (near.length) instances(scene, clumpGeo(5, 2600, 0.042), mat, near);
  if (o.far) { const [r0, r1, n] = o.far; let tr = 0; while (far.length < n && tr++ < n * 12) { const a = rnd() * 6.283, r = r0 + (r1 - r0) * Math.pow(rnd(), 1.4), x = Math.cos(a) * r, z = Math.sin(a) * r; if (n2(x * 0.02 + 9, z * 0.02) < 0.42) continue; const s = (0.8 + 1.8 * rnd()) * (rnd() < 0.3 ? 1.7 : 1) * (o.fs ?? 1); far.push({ p: [x, height(x, z) - 0.2, z], s: [s, s * (0.8 + 0.5 * rnd()), s], r: [0, rnd() * 6.28, 0] }); }
    instances(scene, clumpGeo(9, 560, 0.085, 0.95), mat, far, { cast: false }); }
}
