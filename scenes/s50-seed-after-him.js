// A field of wheat, green to gold in one wave of wind and light, ears filling and bowing.
export const kind = 'three';
import { shot, THREE, g } from '/song/lib/shot.js';
import { U, M } from '/song/lib/core.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { instances } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s50-seed-after-him', {
  sky: { hour: 'golden', az: 235, extent: 9, center: [0, 0.8, 6], gust: 0.8, el: 18 },
  build(S) {
    const R = camp(S, { at: [0, 5], n: 6000, r: 14, tents: 1, flowers: 0, spots: [[0, 6, 9]], rocks: [] }), sc = S.scene, r = rng(6);
    const P = [], N = [], uv = [], I = []; const tri = (pts, nn, u) => { const b = P.length / 3; pts.forEach((p, i) => { P.push(...p); N.push(...nn); uv.push(u, p[1]); }); for (let i = 1; i + 1 < pts.length; i++) I.push(b, b + i, b + i + 1); };
    for (let k = 0; k < 2; k++) { const a = k * 1.57, c = Math.cos(a) * 0.004, s = Math.sin(a) * 0.004; tri([[-c, 0, -s], [c, 0, s], [c, 0.82, s], [-c, 0.82, -s]], [0.2, 0.7, 0.6], 0); }
    for (let k = 0; k < 2; k++) { const a = k * 2.5 + 0.4, c = Math.cos(a), s = Math.sin(a), y0 = 0.22 + 0.25 * k; tri([[0, y0, 0], [c * 0.09 - s * 0.006, y0 + 0.16, s * 0.09 + c * 0.006], [c * 0.20, y0 + 0.10, s * 0.20], [c * 0.09 + s * 0.006, y0 + 0.16, s * 0.09 - c * 0.006]], [0.1, 0.8, 0.3], 0.3); }
    for (let i = 0; i < 9; i++) for (const sg of [-1, 1]) { const y0 = 0.80 + i * 0.0135, a = i % 2 ? 1.57 : 0, c = Math.cos(a) * sg, s = Math.sin(a) * sg; tri([[0, y0, 0], [c * 0.0155 - s * 0.006, y0 + 0.012, s * 0.0155 + c * 0.006], [c * 0.0165, y0 + 0.030, s * 0.0165], [c * 0.0155 + s * 0.006, y0 + 0.012, s * 0.0155 - c * 0.006]], [c * 0.7, 0.5, s * 0.7 + 0.3], 1); tri([[c * 0.014, y0 + 0.024, s * 0.014], [c * 0.015 + 0.0012, y0 + 0.026, s * 0.015], [c * 0.026, y0 + 0.115, s * 0.026]], [c * 0.5, 0.6, s * 0.5], 2); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(I);
    const mat = M('plain', { side: THREE.DoubleSide, transl: 0.9, u: { uFr: -20 }, vertHead: ' ', vert: `{ vec4 wp = instanceMatrix * vec4(0., 0., 0., 1.); float rp = smoothstep(-1.5, 1.5, uFr - (wp.x * .55 - wp.z) + 2. * (vn(wp.xz * .5) - .5)); vIH = floor(vIH * 64.) / 64. + rp / 128.; float gw = vn(vec2(wp.x, wp.z) * .30 - uWind.xz * uTime * .7); float gq = vn(vec2(wp.x, wp.z) * 1.2 - uWind.xz * uTime * 1.6); float wv = exp(-pow((uFr - (wp.x * .55 - wp.z)) / 1.6, 2.)); float k = position.y * position.y; vec3 off = uWind * (uGust * (.06 + .22 * gw * gw + .05 * gq) + .30 * wv) * k; float bow = rp * .10 * smoothstep(.55, 1., position.y) * (0.5 + vIH); off += vec3(bow, -bow * .6, 0.); transformed += inverse(mat3(instanceMatrix)) * vec3(off.x, off.y - .25 * length(off.xz), off.z); if (uv.x > .9 && uv.x < 1.5) transformed.xz *= .75 + .4 * rp; }`,
      surf: `float rp = fract(ih * 64.) * 2.; float q = floor(ih * 64.) / 64.; vec3 gr = mix(vec3(.10, .24, .03), vec3(.20, .36, .07), q), go = mix(vec3(.62, .40, .12), vec3(.86, .62, .25), q); alb = mix(gr, go, clamp(rp + .25 * (uv.y - .6), 0., 1.)); alb *= .25 + .85 * smoothstep(.0, .9, uv.y); if (uv.x > .9) alb *= .8 + .5 * fract(uv.y * 74.); rough = .55;` });
    const list = []; for (let i = 0; i < 15000; i++) { const z = 8.8 - 14 * Math.pow(r(), 1.25), w = 2.2 + (9 - z) * 0.85, x = (r() - 0.5) * 2 * w; const s = 0.95 + 0.35 * r(); list.push({ p: [x, G(x, z) - 0.02, z], s: [s, s * (0.9 + 0.25 * r()), s], r: [(r() - 0.5) * 0.16, r() * 6.28, (r() - 0.5) * 0.16] }); } const im = instances(sc, geo, mat, list);
    const st = K.staff(sc, { p: at(1.7, 4.6), h: 1.9 });
    return { update(t) { mat.userData.u.uFr.value = -11.5 + 21 * Math.max(0, Math.min(1, (t - 238.6) / 4.6)); U.uGust.value = 0.7 + 0.8 * g(t, 239.2, 1.2, 1.0, 2); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-1.4, 1.5, 10.4], [-0.3, 1.9, 10.2], [0.8, 2.6, 9.9]], look: [[0.2, 0.75, 3], [0.2, 0.65, 3], [0.2, 0.6, 3]], fov: [42, 42], enter: 'moving', exit: 'moving', handheld: 0.1, aperture: 0.005, focus: 2.4 }),
});
