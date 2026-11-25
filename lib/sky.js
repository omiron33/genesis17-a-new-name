// The sky over Mambre: a dome drawn in the shader (gradient, sun and its glow, lit cloud, stars and the
// Milky Way), the same sky as the light that fills shadows, and the air between things.
import * as THREE from 'three';
import { GLSL_NOISE } from '/song/lib/noise.js';
import { U, Light } from '/song/lib/core.js';

const sunv = (az, el) => { const a = az * Math.PI / 180, e = el * Math.PI / 180; return [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)]; };
// hours of the one day. zen/hor: sky; glow: round the sun; sun: colour x intensity; sky: fill light
export const HOURS = {
  stars:     { el: 34, zen: [0.010, 0.022, 0.060], hor: [0.045, 0.085, 0.150], glow: [0.05, 0.08, 0.14], sun: [0.62, 0.76, 1.0], sunI: 1.05, sky: [0.45, 0.62, 1.0], skyI: 0.42, stars: 1, cover: 0.28, cloudL: [0.10, 0.14, 0.22], cloudD: [0.02, 0.035, 0.07], fog: 0.0012, disc: 0, exposure: 1.35, env: 1.0 },
  predawn:   { el: 3, zen: [0.030, 0.065, 0.165], hor: [0.52, 0.34, 0.30], glow: [0.9, 0.42, 0.20], sun: [1.0, 0.62, 0.42], sunI: 0.75, sky: [0.46, 0.60, 1.0], skyI: 0.75, stars: 0.55, cover: 0.40, cloudL: [0.85, 0.42, 0.34], cloudD: [0.06, 0.08, 0.15], fog: 0.0016, disc: 0, exposure: 1.2, env: 1.0 },
  sunrise:   { el: 7, zen: [0.10, 0.22, 0.46], hor: [0.95, 0.62, 0.40], glow: [2.2, 1.15, 0.48], sun: [1.0, 0.66, 0.36], sunI: 4.0, sky: [0.60, 0.72, 1.0], skyI: 0.95, stars: 0, cover: 0.46, cloudL: [1.5, 0.95, 0.62], cloudD: [0.20, 0.20, 0.28], fog: 0.0017, disc: 1, exposure: 1.0, env: 1.0 },
  morning:   { el: 24, zen: [0.10, 0.26, 0.62], hor: [0.62, 0.74, 0.86], glow: [1.0, 0.80, 0.52], sun: [1.0, 0.88, 0.70], sunI: 4.6, sky: [0.62, 0.78, 1.0], skyI: 1.0, stars: 0, cover: 0.48, cloudL: [1.35, 1.25, 1.12], cloudD: [0.42, 0.47, 0.58], fog: 0.0010, disc: 1, exposure: 0.86, env: 1.0 },
  noon:      { el: 58, zen: [0.09, 0.25, 0.66], hor: [0.60, 0.74, 0.90], glow: [0.8, 0.75, 0.6], sun: [1.0, 0.95, 0.85], sunI: 4.8, sky: [0.64, 0.80, 1.0], skyI: 1.05, stars: 0, cover: 0.50, cloudL: [1.4, 1.36, 1.3], cloudD: [0.5, 0.55, 0.66], fog: 0.0008, disc: 1, exposure: 0.80, env: 1.0 },
  afternoon: { el: 30, zen: [0.085, 0.24, 0.62], hor: [0.66, 0.70, 0.72], glow: [1.3, 0.95, 0.52], sun: [1.0, 0.84, 0.60], sunI: 4.7, sky: [0.62, 0.76, 1.0], skyI: 0.95, stars: 0, cover: 0.46, cloudL: [1.45, 1.22, 0.95], cloudD: [0.42, 0.43, 0.50], fog: 0.0011, disc: 1, exposure: 0.88, env: 1.0 },
  golden:    { el: 11, zen: [0.085, 0.20, 0.50], hor: [0.95, 0.66, 0.42], glow: [1.9, 1.05, 0.42], sun: [1.0, 0.70, 0.36], sunI: 4.8, sky: [0.58, 0.68, 0.95], skyI: 0.85, stars: 0, cover: 0.44, cloudL: [1.6, 1.02, 0.60], cloudD: [0.30, 0.26, 0.30], fog: 0.0015, disc: 1, exposure: 0.98, env: 1.0 },
  sunset:    { el: 3.5, zen: [0.07, 0.11, 0.26], hor: [0.95, 0.44, 0.24], glow: [2.2, 0.85, 0.28], sun: [1.0, 0.50, 0.22], sunI: 3.2, sky: [0.52, 0.58, 0.90], skyI: 0.80, stars: 0.05, cover: 0.50, cloudL: [1.5, 0.62, 0.38], cloudD: [0.20, 0.14, 0.19], fog: 0.0017, disc: 1, exposure: 1.1, env: 1.0 },
  dusk:      { el: 2, zen: [0.022, 0.045, 0.125], hor: [0.40, 0.23, 0.20], glow: [0.55, 0.26, 0.16], sun: [0.66, 0.70, 1.0], sunI: 0.5, sky: [0.46, 0.58, 1.0], skyI: 0.62, stars: 0.7, cover: 0.34, cloudL: [0.42, 0.24, 0.22], cloudD: [0.05, 0.06, 0.11], fog: 0.0015, disc: 0, exposure: 1.25, env: 1.0 },
};
export const SKY_GLSL = /* glsl */ `
uniform vec3 uZen, uHor, uGlow, uCloudL, uCloudD, uSunDirS, uSunColS; uniform float uStars, uCover, uDisc, uSkyT, uSkyRot, uSeedS, uRise;
float cloudDen(vec2 q) { vec2 w = vec2(fb(q * .9 + 3.1), fb(q * .9 + 11.7)); float n = fb(q + 1.1 * w); float big = vn(q * .22 + 5.); return smoothstep(1. - uCover - .16 * (big - .5), 1. - uCover + .30, n + .16); }
vec3 skyCol(vec3 d) {
  float y = max(d.y, 0.); float s = max(dot(d, uSunDirS), 0.);
  vec3 c = mix(uHor, uZen, pow(1. - exp(-y * 4.2), .85));
  c += uGlow * (.30 * pow(s, 5.) * exp(-y * 2.2) + .55 * pow(s, 48.) + .5 * pow(s, 420.));
  c = mix(c, uHor * .9 + uGlow * .22 * pow(s, 4.), exp(-y * 15.) * .55);
  if (uStars > .001) {
    float ca = cos(uSkyRot), sa = sin(uSkyRot); vec3 ax = normalize(vec3(.0, .62, -.78)); vec3 r = d * ca + cross(ax, d) * sa + ax * dot(ax, d) * (1. - ca);
    vec3 st = vec3(0.);
    for (int k = 0; k < 3; k++) { float sc = k == 0 ? 90. : k == 1 ? 190. : 340.; vec3 q = r * sc, id = floor(q), f = fract(q) - .5; vec3 h = nh3(id + float(k) * 17.); float clump = vn(id * .16 + 7.); float on = step((k == 0 ? .972 : k == 1 ? .974 : .965) - .03 * clump, h.x);
      float dd = length(f - (h - .5) * .5); float m = pow(h.y, 5.) * (k == 0 ? 5. : k == 1 ? 2.4 : 1.2) + (k == 2 ? .14 : .2); st += on * m * exp(-dd * dd * (k == 0 ? 46. : 38.)) * mix(vec3(1., .82, .62), vec3(.68, .82, 1.), h.z); }
    vec3 gn = normalize(vec3(.55, .35, .75)); float b = dot(r, gn); float mw = exp(-b * b * 14.); vec3 rr = r * 3.; float n = fb(rr * 1.6), n2 = fb(rr * 4.5 + 7.);
    float dust = smoothstep(.38, .68, fb(rr * 2.3 + 21.)) * exp(-b * b * 60.);
    vec3 milky = mw * (.25 + 1.3 * n * n) * (.6 + .6 * n2) * (1. - .85 * dust) * vec3(.62, .70, .95) * .62 + mw * mw * .22 * vec3(1., .78, .55) * n;
    c += (st * 1.15 + milky * .8) * uStars * smoothstep(.0, .16, d.y);
  }
  if (uDisc > .5) c += uSunColS * (smoothstep(.99990, .99996, dot(d, uSunDirS)) * 26.);
  if (d.y > .015) {
    vec2 q = d.xz / (d.y + .09) * .62 + uSeedS + vec2(uSkyT * .010, uSkyT * .004); float den = cloudDen(q);
    if (den > .003) {
      vec2 toS = normalize(uSunDirS.xz + 1e-4) * .10; float occ = 0.; for (int i = 1; i <= 3; i++) occ += cloudDen(q + toS * float(i)) * .34;
      float lit = exp(-occ * 1.9), edge = pow(1. - den, 2.);
      vec3 cc = mix(uCloudD, uCloudL, lit * .8 + .1) + uCloudL * (pow(s, 6.) * (.6 * edge + .2) * 1.2 + pow(s, 60.) * edge * 1.5);
      float far = smoothstep(.015, .16, d.y); c = mix(c, mix(c, cc, .9), den * far * .94);
    }
  }
  if (uRise > .001) { c += vec3(1., .86, .58) * uRise * (exp(-dot(d - vec3(0., 1., 0.), d - vec3(0., 1., 0.)) * 3.)); }
  return c;
}`;
// makeSky(scene, renderer, { hour, az, el, cover, seed, ...overrides, extent, center }) -> { light, update(t), H, u }
export function makeSky(scene, renderer, o) {
  const H = { ...HOURS[o.hour], ...o };
  const dir = sunv(o.az ?? 140, H.el);
  const V = (a) => ({ value: new THREE.Vector3(...a) }), F = (x) => ({ value: x });
  const u = { uZen: V(H.zen), uHor: V(H.hor), uGlow: V(H.glow), uCloudL: V(H.cloudL), uCloudD: V(H.cloudD), uSunDirS: V(dir), uSunColS: V(H.sun), uStars: F(H.stars), uCover: F(H.cover), uDisc: F(H.disc), uSkyT: F(0), uSkyRot: F(o.rot ?? 0), uSeedS: F(o.seed ?? 3.7), uRise: F(0) };
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: u, vertexShader: 'varying vec3 vD; void main() { vD = position; vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0); gl_Position = p.xyww; }',
    fragmentShader: `varying vec3 vD; ${GLSL_NOISE} ${SKY_GLSL} void main() { vec3 d = normalize(vD); gl_FragColor = vec4(d.y > -.02 ? skyCol(d) : mix(uHor, vec3(0.), 0.), 1.0); }` });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 32), mat); dome.frustumCulled = false; dome.renderOrder = -10; scene.add(dome);
  // the same sky, with the ground's bounce below, as the environment for reflections and fill
  const envScene = new THREE.Scene(); const gb = o.bounce ?? [0.30, 0.24, 0.16];
  const li = Math.max(0.02, Math.sin(H.el * Math.PI / 180)) * H.sunI * 0.22 + 0.12 * H.skyI; const gc = gb.map((x, i) => x * (H.sun[i] * li + H.sky[i] * H.skyI * 0.16));
  const envMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { ...u, uGround: V(gc), uStars: F(0), uDisc: F(0) }, vertexShader: 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `varying vec3 vD; uniform vec3 uGround; ${GLSL_NOISE} ${SKY_GLSL} void main() { vec3 d = normalize(vD); vec3 c = min(skyCol(d), vec3(3.)); gl_FragColor = vec4(mix(uGround, c, smoothstep(-.06, .04, d.y)), 1.0); }` });
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(5, 48, 24), envMat));
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(envScene, 0.02, 0.1, 100).texture; scene.environmentIntensity = H.env * (o.envK ?? 0.9);
  scene.fog = new THREE.FogExp2(0x888888, 0.001);
  U.uFogCol.value.set(...H.hor.map((x, i) => 0.62 * x + 0.22 * H.zen[i])); U.uFogSun.value.set(...H.glow.map((x) => x * 0.55)); U.uFogDen.value = H.fog * (o.fogK ?? 1); U.uFogH.value = 0.010;
  // at night the light that shapes things is the moon, high and opposite the afterglow
  const moon = H.stars > 0.4; const ld = moon ? sunv(o.moonAz ?? (o.az ?? 140) + 150, o.moonEl ?? 38) : dir;
  const light = new Light(scene, { dir: ld, color: H.sun, intensity: H.sunI * Math.PI * (o.sunK ?? 1), sky: H.sky, skyI: H.skyI * (o.skyK ?? 1.15), extent: Math.max(8, o.extent ?? 14), center: o.center ?? [0, 1, 0], disc: o.disc ?? 0.040, map: 4096, skyMap: 2048 });
  if (moon) light.airDir = new THREE.Vector3(...dir);
  return { light, H, u, dome, dir, setSun(d) { light.dir.set(...d).normalize(); u.uSunDirS.value.copy(light.dir); }, update(t) { U.uTime.value = t; u.uSkyT.value = t; light.at(t); } };
}
// blend two hours (for days that race by): k 0..1; sunDir given
export function blendSky(sk, scene, a, b, k, sunDir, moon) {
  const A = HOURS[a], B = HOURS[b], L = (x, y) => x.map((v, i) => v + (y[i] - v) * k), N = (x, y) => x + (y - x) * k, u = sk.u;
  u.uZen.value.set(...L(A.zen, B.zen)); u.uHor.value.set(...L(A.hor, B.hor)); u.uGlow.value.set(...L(A.glow, B.glow)); u.uCloudL.value.set(...L(A.cloudL, B.cloudL)); u.uCloudD.value.set(...L(A.cloudD, B.cloudD)); u.uStars.value = N(A.stars, B.stars); u.uDisc.value = N(A.disc, B.disc) > 0.5 ? 1 : 0; u.uSunColS.value.set(...L(A.sun, B.sun));
  u.uSunDirS.value.set(...sunDir).normalize(); sk.light.dir.set(...(moon ?? sunDir)).normalize(); sk.light.sun.color.setRGB(...L(A.sun, B.sun)); sk.light.sun.intensity = N(A.sunI, B.sunI) * Math.PI; sk.light.sky.color.setRGB(...L(A.sky, B.sky)); sk.light.sky.intensity = N(A.skyI, B.skyI) * 1.15;
  U.uFogCol.value.set(...L(A.hor, B.hor).map((x, i) => 0.62 * x + 0.22 * N(A.zen[i], B.zen[i]))); U.uFogSun.value.set(...L(A.glow, B.glow).map((x) => x * 0.55));
  return N(A.exposure, B.exposure);
}
export { sunv };
