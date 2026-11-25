// Days and nights go over the oak, sun and stars in turn; the light at its foot does not change.
export const kind = 'three';
import { shot, THREE, ease } from '/song/lib/shot.js';
import { U } from '/song/lib/core.js';
import { HOURS } from '/song/lib/sky.js';
import { camp, at, K } from '/song/lib/sets.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
const mixH = (A, B, k) => { const r = {}; for (const q of Object.keys(A)) r[q] = Array.isArray(A[q]) ? A[q].map((v, i) => v + (B[q][i] - v) * k) : A[q] + (B[q] - A[q]) * k; return r; };
const sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
export default shot('s17-everlasting', {
  sky: { hour: 'morning', az: 90, extent: 14, center: [0, 3, -3], gust: 0.7, cover: 0.42 },
  build(S, P) {
    const R = camp(S, { at: [0, 3], n: 52000, r: 12, tents: 2, altar: true, hearth: { I: 8 } }), sc = S.scene; const st = K.staff(sc, { p: at(0.1, -2.6) }); K.lean(st, 0.03, 1);
    const Gy = glory(sc, { from: [3.5, 17, 7.0], to: at(0.1, -2.6), angle: 0.085, I: 8500, air: 2.6 }); S.expo = 1; const u = S.sky.u, L = S.sky.light;
    return { update(t) { R.hearth.set(t); const x = (t - P.from) / (P.to - P.from), a = 0.42 + x * 2 * Math.PI * 1.97, s = Math.sin(a), c = Math.cos(a);
      const night = sm(0.10, -0.42, s), warm = Math.exp(-Math.pow((s - 0.10) / 0.24, 2)); const H = mixH(mixH(HOURS.noon, HOURS.golden, warm), HOURS.stars, night);
      u.uZen.value.set(...H.zen); u.uHor.value.set(...H.hor); u.uGlow.value.set(...H.glow); u.uCloudL.value.set(...H.cloudL); u.uCloudD.value.set(...H.cloudD); u.uStars.value = H.stars; u.uDisc.value = s > 0.01 ? 1 : 0; u.uSunColS.value.set(...H.sun);
      const sd = [c * 0.85, Math.max(0.03, s * 0.8), -0.45], mo = [-c * 0.6, 0.62, 0.45]; u.uSunDirS.value.set(...sd).normalize();
      // the sun's light is gone before the moon's begins, so nothing jumps
      const dayK = sm(0.02, 0.30, s), moonK = sm(-0.06, -0.40, s); L.dir.set(...(s > -0.02 ? sd : mo)).normalize(); L.airDir = new THREE.Vector3(...sd).normalize(); L.sun.color.setRGB(...(s > -0.02 ? mixH(HOURS.noon, HOURS.golden, warm).sun : HOURS.stars.sun)); L.sun.intensity = Math.PI * (s > -0.02 ? 4.6 * dayK : 1.5 * moonK);
      L.sky.color.setRGB(...H.sky); L.sky.intensity = H.skyI * 1.15; U.uFogCol.value.set(...H.hor.map((v, i) => 0.62 * v + 0.22 * H.zen[i])); U.uFogSun.value.set(...H.glow.map((v) => v * 0.55)); sc.environmentIntensity = 0.9 * (1 - 0.80 * night); S.expo = Math.min(1.35, H.exposure); u.uSkyRot.value = a * 0.35; Gy.set(t, 0.9 - 0.25 * night); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-3.2, 1.2, 8.6], [-1.0, 1.7, 8.8], [1.8, 2.4, 8.4]], look: [[0, 2.8, -4], [0, 3.0, -4], [0, 3.1, -4]], fov: 52, enter: 'moving', exit: 'moving', handheld: 0.15 }),
  post: (t, S) => ({ exposure: (S.expo ?? 1) * 0.97 }),
});
