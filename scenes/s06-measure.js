// A wooden measure fills with grain, heaps, and on "beyond measure" runs over on every side.
export const kind = 'three';
import { shot, THREE, ease } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s06-measure', {
  sky: { hour: 'sunrise', az: 118, extent: 3.2, center: [0, 1, 2.2], gust: 0.5, el: 5 },
  build(S, P) {
    const R = bench(S, { bx: 0, bz: 2.2, hearth: true, jars: true, bseed: 12 }), y = R.top, c = [0.0, y, 2.25];
    K.jar(S.scene, [c[0], y - 0.004, c[2]], { kind: 'measure', mt: K.mat('paleWood', { side: THREE.DoubleSide, uvless: true }), seed: 2, handles: false });
    for (const h of [0.05, 0.27]) { const T = new THREE.TorusGeometry(0.222, 0.008, 8, 80); T.rotateX(Math.PI / 2); K.mesh(T, K.mat('leather', { uvless: true }), S.scene, [c[0], y + h, c[2]]); }
    K.bag(S.scene, [0.72, y, 2.0], { s: 1.2, seed: 8, mt: 'leather' }); K.jar(S.scene, [-0.72, y, 2.0], { s: 0.55, seed: 4 });
    // the heap inside, rising to a cone
    const hp = new THREE.CircleGeometry(1, 60, 0, 6.283), H = new THREE.PlaneGeometry(1, 1); const cone = new THREE.ConeGeometry(0.205, 1, 80, 24, true); cone.translate(0, 0.5, 0); const heap = K.mesh(cone, K.mat('plain', { uvless: true, surf: 'vec3 ce = cell(p * vec3(150., 60., 150.)); alb = mix(vec3(.46, .27, .09), vec3(.82, .58, .26), ce.z) * smoothstep(-.1, .5, ce.y - ce.x + .2); rough = .55; h = .004 * smoothstep(.5, .0, ce.x);' }), S.scene, c);
    const r = rng(4), n = 4600, geo = new THREE.SphereGeometry(1, 7, 5); geo.scale(0.0038, 0.0038, 0.0080); const im = new THREE.InstancedMesh(geo, K.mat('grain'), n); im.castShadow = im.receiveShadow = true; im.frustumCulled = false; S.scene.add(im);
    const G = [...Array(n)].map((_, i) => { const pour = i < 1500, a = r() * 6.283; return { pour, a, q: Math.sqrt(r()), t0: pour ? P.from - 0.6 + (P.to - P.from + 0.6) * r() : 29.2 + 1.95 * Math.pow(r(), 0.8), v: 0.32 + 0.5 * r(), e: [r() * 6, r() * 6, r() * 6], rr: r() }; });
    const m = new THREE.Matrix4(), qn = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), o0 = new THREE.Vector3(0.0001, 0.0001, 0.0001), p = new THREE.Vector3();
    const lev = (t) => 0.10 + 0.195 * Math.min(1, (t - P.from) / 1.6), hc = (t) => 0.02 + 0.115 * ease.inOut3((t - 28.6) / 1.6);
    return { update(t) { R.hearth.set(t); const L = lev(t), hh = hc(t); heap.position.y = y + L; heap.scale.set(1, hh, 1);
      for (let i = 0; i < n; i++) { const q = G[i], d = t - q.t0; let ok = d > 0;
        if (q.pour) { const fall = 1.15 - 4.9 * d * d, top = L + hh * (1 - q.q * 0.25); if (fall < top - 0.01 || !ok) ok = false; p.set(c[0] + Math.cos(q.a) * 0.045 * q.q + 0.05 * Math.max(0, fall - top), y + Math.max(fall, top), c[2] + Math.sin(q.a) * 0.03 * q.q); }
        else if (ok) { const run = 0.205, slide = d * 0.55; let rad, yy; if (slide < run) { rad = slide; yy = L + hh * (1 - rad / run) + 0.004; } else { const tf = (slide - run) / 0.55; rad = run + 0.012 + q.v * 0.62 * Math.min(tf, 0.27); const top = L + 0.01; yy = top - 4.9 * tf * tf; const tl = Math.sqrt(top / 4.9); if (tf > tl) { const s2 = tf - tl; rad = run + 0.02 + q.v * 0.62 * 0.25 + (0.08 + 0.34 * q.rr) * (1 - Math.exp(-s2 * 5)); yy = 0.006 + 0.03 * Math.abs(Math.sin(s2 * 14)) * Math.exp(-s2 * 8) + 0.012 * q.rr * Math.exp(-Math.pow((rad - 0.27) / 0.05, 2)); } } p.set(c[0] + Math.cos(q.a) * rad, y + yy, c[2] + Math.sin(q.a) * rad); }
        e.set(q.e[0] + d * 7 * (p.y > y + 0.03 ? 1 : 0), q.e[1], q.e[2]); qn.setFromEuler(e); m.compose(p, qn, ok ? one : o0); im.setMatrixAt(i, m); }
      im.instanceMatrix.needsUpdate = true; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.9, 1.10, 3.75], [-0.45, 1.06, 3.65], [0.15, 1.12, 3.55]], look: [[0, 0.86, 2.2], [0, 0.84, 2.2], [0.02, 0.82, 2.2]], fov: [37, 35], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.006, focus: 1.5 }),
});
