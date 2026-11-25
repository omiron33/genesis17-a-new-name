// A pomegranate bough: buds swell, redden and round into fruit, and the bough bends with the weight.
export const kind = 'three';
import { shot, THREE, br, ease } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { leafMat } from '/song/lib/tree.js';
const leafBlade = () => { const nu = 4, nv = 8, P = [], N = [], uv = [], I = []; for (let j = 0; j <= nv; j++) { const v = j / nv, w = 0.028 * Math.pow(Math.sin(Math.PI * (0.04 + 0.94 * v)), 0.75); for (let i = 0; i <= nu; i++) { const x = (i / nu - 0.5) * 2; P.push(x * w, 0.16 * v, 0.022 * Math.sin(v * 2.4) - 0.030 * v * v + 0.010 * x * x); N.push(0.25 * x, 0.35, 0.9); uv.push(i / nu, v); } } for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i; I.push(a, a + 1, a + nu + 1, a + 1, a + nu + 2, a + nu + 1); } const g0 = new THREE.BufferGeometry(); g0.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g0.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g0.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g0.setIndex(I); g0.computeVertexNormals(); return g0; };
import { M } from '/song/lib/core.js';
import { rng, lerp } from '/song/lib/noise.js';
import { rig, spring, follow, stagger } from '/kit/motion.js';
export default shot('s13-fruitful', {
  sky: { hour: 'morning', az: 48, extent: 3.5, center: [0, 1.6, 2.4], gust: 0.5, el: 22 },
  build(S) {
    const R = camp(S, { at: [0, -1], oak: { at: [2.5, -0.1, -13] }, n: 16000, r: 9, tents: 1, flowers: 120, far: 260 }), sc = S.scene, r = rng(5);
    const B = new THREE.Group(); B.position.set(-1.5, 2.05, 2.2); sc.add(B);
    // the bough bends from its left end: its points recomputed each frame as a curve of growing droop
    const lf = leafMat({ colA: [0.06, 0.13, 0.03], colB: [0.20, 0.29, 0.07], transl: 1.1 }), tube = K.liveTube(sc, K.mat('bark', {}, 'twig'), { n: 80, S: 10 }); const twigs = [...Array(9)].map(() => K.liveTube(sc, K.mat('bark', {}, 'twig'), { n: 14, S: 6 }));
    const main = (u, d) => { const a = 0.10 - d * 0.85 * u; return [-1.6 + 3.1 * u * (1 - 0.06 * d * u), 2.0 + 0.28 * u - d * 0.62 * u * u + 0.05 * Math.sin(u * 9), 2.3 + 0.10 * Math.sin(u * 5)]; };
    const F = [...Array(9)].map((_, i) => ({ u: 0.18 + 0.79 * (i + 0.3 * r()) / 9, len: 0.03 + 0.05 * r(), side: (i % 2 ? 1 : -1) * (0.05 + 0.14 * r()), s: 0.085 + 0.050 * r(), t0: 61.9 + 1.5 * (i * 0.61803 % 1), rot: r() * 6 }));
    const fg = new THREE.SphereGeometry(1, 40, 30), fp = fg.attributes.position; for (let i = 0; i < fp.count; i++) { const x = fp.getX(i), y = fp.getY(i), z = fp.getZ(i), a = Math.atan2(z, x), k = 1 + 0.045 * Math.cos(a * 6 + 0.4 * Math.sin(y * 3)) - 0.10 * Math.max(0, -y - 0.6); fp.setXYZ(i, x * k, y * 0.94, z * k); } fg.computeVertexNormals();
    const cg = new THREE.CylinderGeometry(0.17, 0.10, 0.30, 24, 4, true), cp = cg.attributes.position; for (let i = 0; i < cp.count; i++) { const a = Math.atan2(cp.getZ(i), cp.getX(i)), y = cp.getY(i); if (y > 0.1) { const k = 1 + 0.35 * Math.cos(a * 6); cp.setXYZ(i, cp.getX(i) * (1 + 0.3 * k), y + 0.07 * Math.cos(a * 6), cp.getZ(i) * (1 + 0.3 * k)); } } cg.rotateX(Math.PI); cg.translate(0, -1.0, 0); cg.computeVertexNormals();
    const fr = F.map((f) => { const m = M('fruit', { u: { uRipe: 0 }, uvless: true, surf: 'alb = mix(vec3(.22, .38, .08) * (.8 + .4 * f), alb, smoothstep(0., 1., uRipe + .35 * (f - .5)));', clearcoat: 0.25, ccRough: 0.35 }); const g = new THREE.Group(); K.mesh(fg, m, g); K.mesh(cg, m, g); sc.add(g); return { g, m }; });
    const n = 760, im = new THREE.InstancedMesh(leafBlade(), lf, n); im.castShadow = im.receiveShadow = true; im.frustumCulled = false; sc.add(im); const LS = [...Array(n)].map(() => ({ u: 0.06 + 0.94 * r(), o: [(r() - 0.5) * 0.5, (r() - 0.2) * 0.40, (r() - 0.5) * 0.5], e: [(r() - 0.5) * 2, r() * 6.28, (r() - 0.5) * 2], s: 0.8 + 0.7 * r() })); const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion();
    return { update(t) { const load = (q) => F.reduce((a, f) => a + spring(q, f.t0 + 0.25, { freq: 1.1, damping: 0.42 }), 0) / 9; const d = 0.06 * br(t) + 1.0 * follow(load, t, 0.14) + 0.05 * Math.sin(t * 3); tube.set((u) => main(u, d), 1, (u) => 0.030 * (1 - 0.7 * u) + 0.005);
      F.forEach((f, i) => { const p = main(f.u, d), k = spring(t, f.t0, { freq: 0.62, damping: 0.50 }), sw = 0.10 * Math.sin(t * 2.6 + i) * k; const e = [p[0] + sw * 0.5, p[1] - f.len - 0.06 * k, p[2] + f.side]; twigs[i].set((u) => [lerp(p[0], e[0], u), lerp(p[1], e[1], u * u), lerp(p[2], e[2], u)], 1, 0.006); const s = f.s * (0.16 + 0.84 * Math.max(0, k)); fr[i].g.position.set(e[0], e[1] - s * 0.9, e[2]); fr[i].g.scale.setScalar(s); fr[i].g.rotation.set(0, f.rot, sw); fr[i].m.userData.u.uRipe.value = ease.inOut3((t - f.t0 - 0.2) / 1.3) * 1.3; });
      LS.forEach((l, i) => { const p = main(l.u, d); q4.setFromEuler(new THREE.Euler(...l.e)); m4.compose(new THREE.Vector3(p[0] + l.o[0], p[1] + l.o[1], p[2] + l.o[2]), q4, new THREE.Vector3(l.s, l.s, l.s)); im.setMatrixAt(i, m4); }); im.instanceMatrix.needsUpdate = true; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.9, 1.35, 4.7], [0.55, 1.35, 4.5], [0.1, 1.40, 4.35]], look: [[0.15, 1.85, 2.2], [0.15, 1.75, 2.2], [0.15, 1.62, 2.2]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.012, focus: 2.3 }),
});
