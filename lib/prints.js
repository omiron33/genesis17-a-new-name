// Footprints pressed into dust: a list of [x, z, heading, size, t]; the ground shader sinks each one as its time comes.
export const PRINT_HEAD = (n, sz = 1.25) => `
#define PSZ ${sz.toFixed(2)}
float sole(vec2 p) { p.x *= 1.0 + .25 * smoothstep(.0, .12, p.y); float ball = length((p - vec2(-.006, .062)) * vec2(1.15, .95)) - .050; float heel = length((p - vec2(.0, -.085)) * vec2(1.05, .9)) - .034; vec2 q = p; float mid = max(abs(q.x - .016) - .017, abs(q.y) - .07); float d = min(min(ball, heel), mid); for (int i = 0; i < 5; i++) { float fi = float(i); vec2 c = vec2(-.050 + .0245 * fi, .138 - .0062 * abs(fi - .6) * fi); d = min(d, length(p - c) - (.0185 - .0022 * fi)); } return d; }
vec2 prints(vec2 w) { float h = 0., dk = 0.; for (int i = 0; i < ${n}; i++) { vec4 P = uPrints[i]; if (P.w < .004) continue; vec2 d = w - P.xy; float sz = (abs(P.z) > 50. ? .72 : 1.) * PSZ; float a = P.z - (abs(P.z) > 50. ? sign(P.z) * 100. : 0.); if (dot(d, d) > .14) continue; float c = cos(a), s = sin(a); vec2 q = vec2(c * d.x + s * d.y, -s * d.x + c * d.y) / sz; float side = fract(float(i) * .5) > .25 ? 1. : -1.; q.x *= side; float sd = sole(q); float in_ = smoothstep(.006, -.010, sd), rim = smoothstep(.022, .0, abs(sd - .010)); h += P.w * (-.034 * in_ + .012 * rim); dk = max(dk, P.w * in_); } return vec2(h, dk); }`;
export const PRINT_SURF = `{ vec2 pr = prints(p.xz); h += pr.x; alb *= 1. - .55 * pr.y; }`;
// a walk along a path: [[x,z],...] points, stride, size (1 man, 0.72 boy), times from t0 at rate
export function walk(path, { stride = 0.62, gauge = 0.085, child = false, t0 = 0, dt = 0.3, n = 12, s0 = 0 }) {
  const out = []; const seg = []; let L = 0; for (let i = 0; i + 1 < path.length; i++) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); seg.push([L, l]); L += l; }
  const at = (d) => { let i = 0; while (i + 1 < seg.length && d > seg[i + 1][0]) i++; const k = Math.min(1, (d - seg[i][0]) / seg[i][1]); const a = path[i], b = path[i + 1]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[0] - a[0], b[1] - a[1])]; };
  for (let i = 0; i < n; i++) { const d = s0 + i * stride; if (d > L) break; const [x, z, hd] = at(d), sd = i % 2 ? 1 : -1, g = gauge * (child ? 0.75 : 1); out.push({ x: x + Math.cos(hd) * g * sd, z: z - Math.sin(hd) * g * sd, a: -hd + 0.12 * sd, t: t0 + i * dt, child }); }
  return out;
}
