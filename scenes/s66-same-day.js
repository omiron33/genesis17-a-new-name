// The two staffs side by side at dusk, each with its sign, lamps round their feet; the tent glows behind.
export const kind = 'three';
import { shot, THREE, ring, br, rise, g } from '/song/lib/shot.js';
import { camp, at, G, K, flames, flick } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { ismael } from '/song/lib/cast.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s66-same-day', {
  sky: { hour: 'dusk', az: 190, moonAz: 50, moonEl: 36, extent: 9, center: [0, 1.2, 2.4], gust: 0.35, skyK: 1.4, sunK: 2.2, envK: 1.2, rot: 0.5 },
  build(S, P) {
    const R = camp(S, { at: [0, 2], n: 46000, r: 11, tents: 3, hearth: { I: 20, smokeCol: [0.2, 0.18, 0.22] }, jars: true, altar: true, flowers: 220 }), sc = S.scene; const tl = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 30, 0, 2); tl.position.set(...at(-9, -3.6, 1.2)); sc.add(tl); const tl2 = new THREE.PointLight(new THREE.Color(1, 0.58, 0.25), 24, 0, 2); tl2.position.set(...at(9.6, -10.5, 1.2)); sc.add(tl2);
    const pa = at(-0.42, 2.2), pb = at(0.55, 2.45); const A = K.staff(sc, { p: pa, h: 1.85 }), B0 = 0; const mk = (o, x, y, r) => { const piv = new THREE.Group(); piv.position.set(x, y, 0.01); o.add(piv); const tk = K.token(piv, [0, -0.30, 0], { r, mark: 1 }); tk.mesh.rotation.x = Math.PI / 2; const C = K.coveCord(piv, { n: 70, r: 0.005, turns: 14 }); C.set((u) => [0, -(0.30 - r) * u, 0], { k: 1.3 }); return { piv, tk }; }; const a = mk(A, 0.235, 1.695, 0.10);
    const I = ismael(S, P, { x: pb[0], z: pb[2], h: 1.25, dir: -1, at: 0.72, tilt: () => 0.02, az: 2, wind: (t) => [-1.3 * br(t), 0.1, -0.5 * br(t + 3)] }), b = mk(I.st, 0.200, 1.10, 0.08);
    const N = 11, pos = [...Array(N)].map((_, i) => { const an = -0.3 + 3.74 * i / (N - 1), r = 1.05 + 0.12 * Math.sin(i * 2.3), x = 0.05 + Math.cos(an) * r, z = 2.35 + Math.sin(an) * r * 0.8; return [x, G(x, z) + 0.01, z]; }); instances(sc, K.lampGeo(), K.mat('clay', { side: THREE.DoubleSide }), pos.map((p, i) => ({ p, s: 1.25, r: [0, i * 1.9, 0] }))); const F = flames(sc, pos.map((p, i) => { const r = i * 1.9; return { p: [p[0] + Math.cos(r) * 0.1025, p[1] + 0.0625, p[2] - Math.sin(r) * 0.1025], h: 0.085, seed: i }; })); const L = [1, 5, 9].map((i) => { const l = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 0, 0, 2); l.position.set(pos[i][0] * 0.8, pos[i][1] + 0.35, pos[i][2]); sc.add(l); return l; });
    return { update(t) { R.hearth.set(t); I.set(t); K.lean(A, 0.03 + 0.06 * rise(t, 320.0, 0.9), Math.PI / 2); a.piv.rotation.z = 0.10 * ring(t, 313.6, 0.6, 0.2) + 0.03 * br(t); b.piv.rotation.z = 0.10 * ring(t, 320.1, 0.7, 0.4) + 0.03 * br(t + 4); a.piv.rotation.y = 0.5 * Math.sin(t * 0.7); b.piv.rotation.y = 0.5 * Math.sin(t * 0.8 + 2); a.tk.set(1, 0.3 + 0.8 * g(t, 316.5, 0.8, 2, 3)); b.tk.set(1, 0.2 + 1.0 * g(t, 320.1, 0.6, 1.5, 3)); pos.forEach((p, i) => F.set(i, Math.max(0, spring(t, 313.8 + 0.68 * i, { freq: 2.4, damping: 0.4 })) * flick(t, i))); L.forEach((l, i) => { l.intensity = 2.2 * rise(t, 314.6 + i * 2.6, 0.8) * flick(t, i); }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-2.6, 0.95, 5.8], [-1.0, 0.95, 6.1], [0.7, 1.05, 6.0], [1.9, 1.25, 5.5]], look: [[-0.1, 0.72, 2.2], [0.0, 0.74, 2.2], [0.05, 0.76, 2.2], [0.1, 0.76, 2.2]], fov: [42, 41], enter: 'moving', exit: 'moving', handheld: 0.09, aperture: 0.004, focus: 3.7 }),
});
