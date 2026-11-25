// The cord strains between two pegs; strand by strand the flax parts, and on "broken" it goes, the ends flying back.
export const kind = 'three';
import { shot, THREE, ease, g, ring } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s36-broken', {
  sky: { hour: 'afternoon', az: 140, extent: 8, center: [0, 0.6, 3], gust: 0.9, el: 16, cover: 0.62 }, exposure: 0.92,
  build(S) {
    const R = camp(S, { at: [0, 1], n: 30000, r: 9, tents: 2, far: 300, hearth: true, spots: [[0, 3, 2.4]] }), sc = S.scene, b = at(0, 3), r = rng(4); for (const s of [-1, 1]) { const z = 3; K.mesh(K.sweep([K.V(s * 0.95, b[1] - 0.2, z), K.V(s * 0.98, b[1] + 0.3, z), K.V(s * 1.0, b[1] + 0.72, z)], 0.045, { S: 14 }), K.mat('wood'), sc); const P = []; for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283 * 4; P.push(K.V(s * 0.985 + Math.cos(a) * 0.052, b[1] + 0.52 + 0.05 * i / 60, z + Math.sin(a) * 0.052)); } K.mesh(K.sweep(P, 0.011, { S: 8 }), K.flaxMat(), sc); }
    const N = 12, T = [172.45, 172.6, 172.72, 172.82, 172.92, 173.0, 173.07, 173.14, 173.20, 173.26, 173.31, 173.36]; const strands = [...Array(N)].map((_, i) => [0, 1].map(() => K.liveTube(sc, K.flaxMat(), { n: 64, r: 0.0052, S: 7 }))); const y = b[1] + 0.55;
    const LM = K.lightMat(0.8), LS = K.liveTube(sc, LM, { n: 120, r: 0.0085 });
    const ph = [...Array(N)].map((_, i) => i / N * 6.283), cut = [...Array(N)].map(() => (r() - 0.5) * 0.05), kk = [...Array(N)].map(() => r() * 6);
    return { update(t) { R.hearth.set(t); const dr = ease.inOut3((t - 173.4) / 0.7); LS.set((u) => [-0.95 + 1.9 * u, y + 0.13 - 0.03 * 4 * u * (1 - u) + 0.008 * Math.sin(u * 9 + t * 8) * Math.exp(-Math.max(0, t - 173.5) * 1.4) * dr, 3]); LM.userData.setK(0.55 + 0.75 * dr); const tens = g(t, 172.2, 0.5, 2, 1); const hum = 0.006 * Math.sin(t * 55) * Math.exp(-Math.max(0, t - 173.36) * 9) * tens; strands.forEach((pair, i) => { const broken = t > T[i], e = Math.max(0, t - T[i]), last = Math.max(0, t - 173.36);
      pair.forEach((tb, sd) => { const s = sd ? 1 : -1, len = 0.96 - 0 * s; const free = last > 0 ? 1 : 0; tb.set((u) => { const x0 = s * 0.95, along = u; const base = [x0 + (cut[i] - x0) * along, y, 3]; const thin = 0.017 * (0.55 + 0.45 * Math.pow(Math.abs(base[0]), 0.5)); const tw = base[0] * 34 + ph[i]; let p = [base[0], base[1] + Math.cos(tw) * thin + hum * Math.sin(Math.PI * (0.5 + 0.5 * base[0])), base[2] + Math.sin(tw) * thin];
        if (broken && !free) { const c = 0.10 * Math.min(1, e * 12), q = Math.max(0, (u - 0.70) / 0.30); p = [p[0] + s * c * q * q * 1.3, p[1] + c * q * q * Math.cos(kk[i] + e * 10) * 1.2, p[2] + c * q * q * Math.sin(kk[i] + e * 10) * 1.2]; }
        if (free) { const L = 0.95, d = L * u, lag = Math.max(0, last - 0.16 * u), th = 1.45 * (1 - Math.exp(-lag * 5.5)) + 0.42 * Math.sin(lag * 9.5) * Math.exp(-lag * 2.0) * u, kick = 0.20 * Math.exp(-last * 6) * u * u; const X0 = s * 0.965, gy = b[1] + 0.025 + 0.012 * (i % 3), fr = Math.pow(Math.max(0, (u - 0.7) / 0.3), 2); let px = X0 - s * Math.cos(th) * d - s * kick, py = y - Math.sin(th) * d + 0.05 * Math.sin(u * 8 - last * 16) * Math.exp(-last * 3) * u, pz = 3 + Math.sin(u * 5 + i) * 0.028 * Math.min(1, last * 2) + 0.06 * Math.sin(last * 5 + i * 0.4) * u * Math.exp(-last * 0.9); if (py < gy) { px -= s * (gy - py) * 0.55; py = gy + 0.006 * Math.sin(i + u * 9); } p = [px + fr * 0.035 * Math.cos(kk[i]), Math.max(gy, py + fr * 0.03 * Math.sin(kk[i])), pz + fr * 0.04 * Math.sin(kk[i] * 1.7)]; } return p; }); }); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.55, 0.80, 4.7], [0.15, 0.72, 4.75], [-0.45, 0.68, 4.85]], look: [[0, 0.56, 3], [0, 0.52, 3], [0, 0.48, 3]], fov: [42, 42], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.008, focus: 1.75 }),
});
