// On "give" the soil opens along a furrow and green comes up in a row towards us.
export const kind = 'three';
import { shot, THREE } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { M } from '/song/lib/core.js';
import { instances } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s18-i-will-give', {
  sky: { hour: 'morning', az: 70, extent: 4, center: [0, 0.5, 4], gust: 0.5, el: 16 },
  build(S) {
    const R = camp(S, { at: [0, 3], n: 40000, r: 11, tents: 2, spots: [[0, 4.5, 3.2], [0, 1.5, 2.4]], keep: (x, z) => !(Math.abs(x) < 1.6 && z > 0.5 && z < 6.5) }), sc = S.scene, r = rng(8);
    const sh = []; for (let row = -2; row <= 2; row++) for (let i = 0; i < 26; i++) { const z = 5.7 - i * 0.22 + r() * 0.06, x = row * 0.42 + (r() - 0.5) * 0.05; sh.push([x, z, Math.abs(row), i, r()]); }
    // clods heaped along each furrow
    const clod = []; for (let row = -2; row <= 2; row++) for (let i = 0; i < 260; i++) { const z = 6.2 - r() * 6, x = row * 0.42 + (r() - 0.5) * 0.17, s = 0.010 + 0.028 * r() * r(); clod.push({ p: [x, G(x, z) + s * 0.25 + 0.03 * Math.exp(-Math.pow((x - row * 0.42) / 0.06, 2)), z], s: [s * 1.2, s * 0.8, s], r: [r() * 6, r() * 6, r() * 6] }); } instances(sc, K.pebbleGeo(2), K.mat('plain', { uvless: true, surf: 'float f = fb(p * 2.); alb = mix(vec3(.11, .065, .038), vec3(.24, .15, .09), f); rough = .95; h = .01 * f;' }, 'clod'), clod);
    const rg = new THREE.PlaneGeometry(1, 1, 24, 120); const ridge = (row) => { const g = new THREE.PlaneGeometry(0.34, 6.2, 22, 130); g.rotateX(-Math.PI / 2); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i) + row * 0.42, z = p.getZ(i) + 3.1; const d = (x - row * 0.42) / 0.085; p.setXYZ(i, x, G(x, z) + 0.045 * Math.exp(-d * d) - 0.012 + 0.010 * Math.sin(z * 31 + row) * Math.exp(-d * d) , z); } g.computeVertexNormals(); return g; }; for (let row = -2; row <= 2; row++) K.mesh(ridge(row), K.mat('plain', { uvless: true, surf: 'float f = fb(p * 9.); alb = mix(vec3(.12, .07, .04), vec3(.27, .17, .10), f) * (.7 + .5 * vn(p * 90.)); rough = .96; h = .014 * f;' }, 'tilth'), sc);
    // a seedling: stem and two leaves
    const P = [], N = [], uv = [], I = []; const add = (...q) => { const b = P.length / 3; q.forEach((v, i) => { P.push(...v); N.push(0, 0.9, 0.3); uv.push([0.5, 0, 0.5, 1][i % 4] , [0, 0.5, 1, 0.5][i % 4]); }); I.push(b, b + 1, b + 2, b, b + 2, b + 3); }; for (let k = 0; k < 3; k++) { const a = k * 2.1; add([Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05], [-Math.sin(a) * 0.05, 0, Math.cos(a) * 0.05], [-Math.sin(a) * 0.04, 1, Math.cos(a) * 0.04], [Math.cos(a) * 0.04, 1, Math.sin(a) * 0.04]); }
    for (const sg of [-1, 1]) for (let k = 0; k < 10; k++) for (let m = 0; m < 4; m++) { const f = (j, w) => [sg * (0.03 + 0.62 * j), 1.0 + 0.45 * Math.sin(j * 1.9) - 0.10 * j * j - 0.10 * w * w * (1 - 0.4 * j), w * Math.pow(Math.sin(Math.PI * (0.04 + 0.93 * j)), 0.7) * 0.22]; const w0 = -1 + m * 0.5, w1 = w0 + 0.5; add(f(k / 10, w0), f(k / 10, w1), f((k + 1) / 10, w1), f((k + 1) / 10, w0)); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(I); const im = instances(sc, g, M('leaf', { side: THREE.DoubleSide, transl: 1.2, u: { uColA: [0.12, 0.26, 0.04], uColB: [0.26, 0.42, 0.08] } }), sh.map(() => ({ p: [0, 0, 0] })));
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(); const st = K.staff(sc, { p: at(0.0, -0.2) });
    return { update(t) { sh.forEach(([x, z, row, i, h], k) => { const t0 = 83.85 + (25 - i) * 0.040 + row * 0.16 + h * 0.12, sp = spring(t, t0, { freq: 1.7, damping: 0.42 }), s = Math.max(0.0001, 0.10 + 0.05 * h) * Math.max(0.0001, sp); q.setFromEuler(new THREE.Euler(0.7 * (1 - Math.min(1, sp)) + 0.05 * Math.sin(t * 3 + k), h * 6.28, 0)); m.compose(new THREE.Vector3(x, G(x, z) + 0.025, z), q, new THREE.Vector3(s, s * 1.1, s)); im.setMatrixAt(k, m); }); im.instanceMatrix.needsUpdate = true; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.95, 0.42, 6.9], [0.55, 0.36, 6.6], [0.1, 0.40, 6.2]], look: [[0.1, 0.28, 2.0], [0.0, 0.30, 2.0], [0, 0.30, 2]], fov: [40, 38], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.006, focus: 1.5 }),
});
