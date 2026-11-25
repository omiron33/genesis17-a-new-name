// Noise: GLSL for the materials and the sky, JS for shaping geometry. Everything seeded.
export const GLSL_NOISE = /* glsl */ `
float nh1(vec3 p) { p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float nh1(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 nh2(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
vec3 nh3(vec3 p) { p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
float vn(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(mix(nh1(i), nh1(i + vec3(1,0,0)), f.x), mix(nh1(i + vec3(0,1,0)), nh1(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(nh1(i + vec3(0,0,1)), nh1(i + vec3(1,0,1)), f.x), mix(nh1(i + vec3(0,1,1)), nh1(i + vec3(1,1,1)), f.x), f.y), f.z); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(nh1(i), nh1(i + vec2(1,0)), f.x), mix(nh1(i + vec2(0,1)), nh1(i + vec2(1,1)), f.x), f.y); }
float fb(vec3 p) { float a = .5, s = 0.; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
float fb3(vec3 p) { float a = .5, s = 0.; for (int i = 0; i < 3; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
float fb(vec2 p) { float a = .5, s = 0.; mat2 m = mat2(.8, -.6, .6, .8); for (int i = 0; i < 5; i++) { s += a * vn(p); p = m * p * 2.03 + 17.1; a *= .5; } return s; }
// cellular: x nearest, y second nearest, z id
vec3 cell(vec3 p) { vec3 i = floor(p), f = fract(p); float a = 9., b = 9., id = 0.;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) { vec3 g = vec3(x, y, z), o = nh3(i + g), r = g + o - f; float d = dot(r, r); if (d < a) { b = a; a = d; id = o.x; } else if (d < b) b = d; }
  return vec3(sqrt(a), sqrt(b), id); }
vec3 cell2(vec2 p) { vec2 i = floor(p), f = fract(p); float a = 9., b = 9., id = 0.;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) { vec2 g = vec2(x, y), o = nh2(i + g), r = g + o - f; float d = dot(r, r); if (d < a) { b = a; a = d; id = o.x; } else if (d < b) b = d; }
  return vec3(sqrt(a), sqrt(b), id); }
`;
export function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hash3(x, y, z) { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const sm = (f) => f * f * f * (f * (f * 6 - 15) + 10);
export const lerp = (a, b, k) => a + (b - a) * k;
export function n3(x, y, z) {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z), u = sm(x - i), v = sm(y - j), w = sm(z - k);
  const c = (a, b, d) => hash3(i + a, j + b, k + d);
  return lerp(lerp(lerp(c(0, 0, 0), c(1, 0, 0), u), lerp(c(0, 1, 0), c(1, 1, 0), u), v), lerp(lerp(c(0, 0, 1), c(1, 0, 1), u), lerp(c(0, 1, 1), c(1, 1, 1), u), v), w);
}
export const n2 = (x, y) => n3(x, y, 0.5);
export function fbm3(x, y, z, o = 4) { let s = 0, a = 0.5, n = 0; for (let i = 0; i < o; i++) { s += a * n3(x, y, z); n += a; x = x * 2.03 + 11.3; y = y * 2.03 + 5.7; z = z * 2.03 + 3.1; a *= 0.5; } return s / n; }
export const fbm2 = (x, y, o = 4) => fbm3(x, y, 0.5, o);
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const smooth = (a, b, x) => { x = clamp((x - a) / (b - a)); return x * x * (3 - 2 * x); };
