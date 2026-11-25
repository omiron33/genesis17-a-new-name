// Ismael: the short staff with its indigo cloth, tied along the shaft as a short banner.
import * as THREE from 'three';
import { K, G } from '/song/lib/sets.js';
import { sheet, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
// tilt(t) radians towards azimuth az; wind(t); foot(t) optional moving foot
export function ismael(S, P, { x, z, h = 1.2, tilt = () => 0.03, az = Math.PI / 2, wind, w = 0.74, ch = 0.42, at = 0.80, foot = null, dir = 1, t0 = 2.2, staff = true }) {
  const sc = S.scene, f = foot ?? (() => [x, G(x, z), z]); const st = K.staff(sc, { p: f(P.from), h, seed: 11, wood: 'paleWood' }); const d = [Math.sin(az), Math.cos(az)];
  const point = (t, y) => { const p = f(t), a = tilt(t), e = K.staffCentre(y, h, 11); return [p[0] + y * d[0] * Math.sin(a) + e[0] + 0.024 * dir, p[1] + y * Math.cos(a), p[2] + y * d[1] * Math.sin(a) + e[2] + 0.012]; };
  const ny = 20, top = h * at; const C = sheet({ w, h: ch, nx: 28, ny, t0: P.from - t0, seed: 8, turb: 0.35, bend: 0.12, rest: (u, v) => { const q = point(P.from - t0, top - v * ch); return [q[0] + dir * u * w * 0.8, q[1] - 0.02 * u, q[2] + 0.04 * Math.sin(u * 11)]; }, pin: (i, j) => (i === 0 ? (t) => point(t, top - j / (ny - 1) * ch) : null), wind, ground: G });
  const cm = clothMesh(sc, C, woolMat(COL.indigo, { threads: 130, transl: 0.85, border: { uBorder: 0.16, uBorderMetal: 0, uBorderCol: [0.60, 0.52, 0.36], uBTeeth: 9 } }));
  const ties = [0, 0.5, 1].map((k) => K.mesh(new THREE.TorusGeometry(0.030, 0.006, 7, 20), K.flaxMat(), st, [...K.staffCentre(top - k * ch, h, 11).map((v, i) => (i === 1 ? top - k * ch : v))])); ties.forEach((m) => { m.rotation.x = Math.PI / 2; });
  return { st, C, set(t) { const p = f(t); st.position.set(...p); K.lean(st, tilt(t), az); cm.set(t); }, point };
}
// a point on the hook of a staff, a 0..3.75 along its curl
export const hookPoint = (a, h = 1.75, seed = 2) => { const t = K.staffCentre(h * 0.86, h, seed), R = h * 0.082, i = a / 3.75; return [t[0] + R - Math.cos(a) * R * (1 - 0.1 * i), h * 0.86 + Math.sin(a) * R * 1.12, t[2] + 0.012 * i]; };
