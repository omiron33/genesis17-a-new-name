// Flames, lamps, smoke, and the light of the Presence: a shaft of light marched through the shadow it casts.
import * as THREE from 'three';
import { GLSL_NOISE } from '/song/lib/noise.js';
import { U, subFrame } from '/song/lib/core.js';
import { fractal } from '/kit/motion.js';

const quadGeo = () => { const g = new THREE.PlaneGeometry(1, 1); g.translate(0, 0.5, 0); return g; };
const BILL = `varying vec2 vUv; varying float vS; uniform vec3 uP; uniform vec2 uSize; void main() { vUv = uv; vec3 up = vec3(0., 1., 0.); vec3 f = normalize(cameraPosition - uP); vec3 r = normalize(cross(up, f)); vec3 u2 = normalize(mix(up, cross(f, r), .25)); gl_Position = projectionMatrix * viewMatrix * vec4(uP + r * position.x * uSize.x + u2 * position.y * uSize.y, 1.); }`;
// one flame: a lamp's drop, or a hearth fire when `wide`
export function flame(scene, p, { h = 0.07, w = 0.035, seed = 1, wide = 0, gain = 1, color = [1, 0.62, 0.22], lean = [0, 0] } = {}) {
  const u = { uP: { value: new THREE.Vector3(...p) }, uSize: { value: new THREE.Vector2(w * 3, h * 1.5) }, uTime: U.uTime, uSeed: { value: seed }, uK: { value: 1 }, uWide: { value: wide }, uCol: { value: new THREE.Vector3(...color) }, uGain: { value: gain }, uLean: { value: new THREE.Vector2(...lean) } };
  const m = new THREE.Mesh(quadGeo(), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: u, vertexShader: BILL, fragmentShader: `varying vec2 vUv; uniform float uTime, uSeed, uK, uWide, uGain; uniform vec3 uCol; uniform vec2 uLean; ${GLSL_NOISE}
    void main() { float y = vUv.y * 1.5, k = max(uK, .001); float sc = mix(.35, 1., clamp(k, 0., 1.)); float yy = y / sc; float x = (vUv.x - .5) * 3. ;
      float wob = (vn(vec2(yy * 1.7 - uTime * 3.1, uSeed)) - .5) * .55 * yy + uLean.x * yy * yy; x = (x - wob) / mix(.6, 1., sc);
      float core;
      if (uWide < .5) { float r = .42 * pow(max(yy, 0.), .42) * pow(max(1. - yy, 0.), .75) * 1.7; core = smoothstep(r, r * .35, abs(x)) * step(0., yy) * smoothstep(1.02, .8, yy) ; }
      else { float n = fb(vec2(x * 1.9 + uSeed, yy * 1.6 - uTime * 1.9)), n2 = fb(vec2(x * 4.2 + uSeed, yy * 3. - uTime * 3.4)); float r = (1.05 - .75 * yy) * (.45 + .95 * n); core = smoothstep(r, r * .25, abs(x)) * smoothstep(1.15, .15, yy + .55 * (1. - n2)); core *= .65 + .7 * n2; }
      float hot = core * core; float base = smoothstep(.0, .10, yy);
      vec3 c = mix(uCol * vec3(1., .55, .25), uCol, core) * core * 1.6 + vec3(1., .86, .58) * hot * 2.4; c = mix(vec3(.10, .18, .6) * core * .6, c, uWide < .5 ? smoothstep(.0, .22, yy) : 1.);
      vec2 hv = vec2(x * .9, (yy - .4) * 1.1); c += uCol * exp(-dot(hv, hv) * 5.) * .10;
      gl_FragColor = vec4(c * uGain * clamp(k, 0., 2.), 1.); }` }));
  m.frustumCulled = false; m.renderOrder = 20; scene.add(m);
  return { mesh: m, u, set(k, pos, lean) { u.uK.value = k; m.visible = k > 0.002; if (pos) u.uP.value.set(...pos); if (lean) u.uLean.value.set(...lean); } };
}
export const flick = (t, s = 1) => 1 + 0.13 * fractal(t * 5.3 + s * 11, { seed: s, octaves: 3 });
export function glow(scene, p, { color = [1, 0.6, 0.28], I = 1.2, dist = 0, shadow = false, decay = 2 } = {}) {
  const l = new THREE.PointLight(new THREE.Color(...color), I, dist, decay); l.position.set(...p); if (shadow) { l.castShadow = true; l.shadow.mapSize.set(512, 512); l.shadow.bias = -0.002; l.shadow.normalBias = 0.02; l.shadow.camera.near = 0.02; l.shadow.camera.far = 14; l.shadow.radius = 3; }
  scene.add(l); return l;
}
// smoke: soft puffs that age along the wind. src(t) position; wind(t) m/s
export function smoke(scene, { at, n = 34, life = 4.5, size = [0.04, 0.42], color = [0.62, 0.62, 0.66], a = 0.075, rise = 0.55, wind = () => [0.25, 0, 0.05], seed = 2, on = () => 1 }) {
  const g = new THREE.InstancedBufferGeometry(); const q = quadGeo(); q.translate(0, -0.5, 0); g.index = q.index; g.setAttribute('position', q.attributes.position); g.setAttribute('uv', q.attributes.uv); const A = new Float32Array(n * 4), B = new Float32Array(n * 2); const aA = new THREE.InstancedBufferAttribute(A, 4), aB = new THREE.InstancedBufferAttribute(B, 2); g.setAttribute('aA', aA); g.setAttribute('aB', aB); g.instanceCount = n;
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uCol: { value: new THREE.Vector3(...color) }, uSun: U.uSunDir }, vertexShader: `attribute vec4 aA; attribute vec2 aB; varying vec2 vUv; varying vec2 vB; void main() { vUv = uv; vB = aB; vec3 f = normalize(cameraPosition - aA.xyz); vec3 r = normalize(cross(vec3(0., 1., 0.), f)), u = cross(f, r); gl_Position = projectionMatrix * viewMatrix * vec4(aA.xyz + (r * position.x + u * position.y) * aA.w, 1.); }`,
    fragmentShader: `varying vec2 vUv, vB; uniform vec3 uCol; ${GLSL_NOISE} void main() { vec2 d = (vUv - .5) * 2.; float r = length(d); float n = fb(vUv * 2.6 + vB.y * 37.); float al = smoothstep(1., .15, r + .55 * (n - .5)) * vB.x * (.5 + n); gl_FragColor = vec4(uCol * (.8 + .4 * n), al); }` }));
  m.frustumCulled = false; m.renderOrder = 18; scene.add(m);
  const hash = (k) => { const s = Math.sin(k * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); };
  return { mesh: m, set(t) {
    for (let i = 0; i < n; i++) {
      const per = life / n, k0 = Math.floor(t / life - i / n), birth = (k0 + i / n) * life, age = t - birth, u = age / life, p = at(birth); const h = hash(k0 * 17 + i);
      let x = p[0], z = p[2]; const S = 5; for (let s = 0; s < S; s++) { const tb = birth + age * (s + 0.5) / S, w = wind(tb), kk = Math.min(1, (s + 1) / S + 0.1) * age / S; x += w[0] * kk; z += w[2] * kk; }
      const y = p[1] + rise * (age - 0.06 * age * age) * (0.9 + 0.2 * h); const c = 0.10 * age * Math.sin(age * 1.7 + h * 6); A[i * 4] = x + c; A[i * 4 + 1] = y; A[i * 4 + 2] = z + 0.08 * age * Math.cos(age * 1.3 + h * 9); A[i * 4 + 3] = (size[0] + (size[1] - size[0]) * Math.pow(u, 0.8)) * (0.8 + 0.5 * h) * 2; B[i * 2] = a * Math.min(1, u * 9) * Math.pow(1 - u, 1.4) * on(birth); B[i * 2 + 1] = h;
    }
    aA.needsUpdate = aB.needsUpdate = true;
  } };
}
// The light of the Presence. A spot from far above, white-gold, casting true shadows; `air` is the light seen
// in the air itself, marched through the shadow map so leaves and cloth cut it into rays.
export function glory(scene, { from = [2, 16, 3], to = [0, 0, 0], angle = 0.16, I = 900, color = [1.0, 0.86, 0.58], air = 1, pen = 0.55, map = 2048, dens = 0.055, disc = 0.95 } = {}) {
  const base = [...from];
  const l = new THREE.SpotLight(new THREE.Color(...color), I, 0, angle, pen, 2); l.position.set(...from); l.target.position.set(...to); l.castShadow = true; l.shadow.mapSize.set(map, map); l.shadow.bias = -0.00012; l.shadow.normalBias = 0.012; l.shadow.radius = 2; scene.add(l, l.target);
  const len = new THREE.Vector3(...from).distanceTo(new THREE.Vector3(...to)); const D = len * 1.12; l.shadow.camera.far = D + 2; l.shadow.camera.near = len * 0.3;
  const cone = new THREE.ConeGeometry(Math.tan(angle) * D, D, 64, 1, true); cone.translate(0, -D / 2, 0); cone.rotateX(-Math.PI / 2);   // apex at the light, opening along +z
  const u = { uMap: { value: null }, uMat: { value: new THREE.Matrix4() }, uPos: { value: l.position }, uDir: { value: new THREE.Vector3() }, uCos: { value: Math.cos(angle) }, uLen: { value: D }, uCol: { value: new THREE.Vector3(...color) }, uAir: { value: air * dens }, uI: { value: 1 }, uTime: U.uTime, uJ: { value: 0 }, uTan: { value: Math.tan(angle) } };
  const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, side: THREE.BackSide, uniforms: u, vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; gl_Position.z = min(gl_Position.z, gl_Position.w * .99999); }',
    fragmentShader: `#include <packing>
varying vec3 vW; uniform sampler2D uMap; uniform mat4 uMat; uniform vec3 uPos, uDir, uCol; uniform float uCos, uLen, uAir, uI, uTime, uJ, uTan; ${GLSL_NOISE}
void main() {
  vec3 ro = cameraPosition, rd = normalize(vW - ro); vec3 co = ro - uPos; float cs = uCos * uCos;
  float dv = dot(rd, uDir), cv = dot(co, uDir), a = dv * dv - cs, b = 2. * (dv * cv - dot(rd, co) * cs), c = cv * cv - dot(co, co) * cs, di = b * b - 4. * a * c; if (di < 0.) discard; di = sqrt(di);
  float t0 = (-b - di) / (2. * a), t1 = (-b + di) / (2. * a); if (t0 > t1) { float q = t0; t0 = t1; t1 = q; }
  float tb = length(vW - ro); bool inside = cv > 0. && cv * cv > cs * dot(co, co);
  float ta = inside ? 0. : max(t0, 0.), te = min(tb, ta + uLen * 1.2); if (inside) te = tb;
  const int N = 18; float dt = (te - ta) / float(N); if (dt <= 0.) discard; float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))) + uJ); float s = 0.;
  for (int i = 0; i < N; i++) { vec3 p = ro + rd * (ta + (float(i) + jit) * dt); vec3 q = p - uPos; float al = dot(q, uDir); if (al < 0. || al > uLen) continue; float rr = length(q - uDir * al) / (al * uTan); if (rr > 1.) continue;
    vec4 sc = uMat * vec4(p, 1.); sc.xyz /= sc.w; float lit = 1.; if (all(greaterThan(sc.xy, vec2(0.))) && all(lessThan(sc.xy, vec2(1.)))) lit = step(sc.z - .0006, unpackRGBAToDepth(texture2D(uMap, sc.xy)));
    float mist = .55 + .9 * vn(p * vec3(.8, .35, .8) + vec3(uTime * .06, -uTime * .10, 0.)); s += lit * smoothstep(1., .25, rr) * mist * smoothstep(.0, .25, al / uLen); }
  gl_FragColor = vec4(uCol * s * dt * uAir * uI, 1.); }` });
  const m = new THREE.Mesh(cone, mat); m.frustumCulled = false; m.renderOrder = 30; scene.add(m);
  return { light: l, u, mesh: m, I, len, set(t, k = 1, pos, target) {
    if (pos) { base[0] = pos[0]; base[1] = pos[1]; base[2] = pos[2]; } { const q = subFrame(t), th = 6.2832 * ((q * 13.6) % 1), r = Math.sqrt(q) * disc; l.position.set(base[0] + Math.cos(th) * r, base[1], base[2] + Math.sin(th) * r); } if (target) l.target.position.set(...target); l.intensity = I * k; l.visible = true; m.visible = k > 0.002 && air > 0; u.uI.value = k; u.uJ.value = subFrame(t) * 7.61;
    l.target.updateMatrixWorld(); l.updateMatrixWorld(); u.uDir.value.subVectors(l.target.position, l.position).normalize(); m.position.copy(l.position); m.lookAt(l.target.position); m.updateMatrixWorld();
    if (l.shadow.map) u.uMap.value = l.shadow.map.texture; l.shadow.updateMatrices(l); u.uMat.value.copy(l.shadow.matrix);
  } };
}

// many flames in one draw: list of { p, h, seed }; set(i, k) strength
export function flames(scene, list, { color = [1, 0.62, 0.22], gain = 1, wide = 0 } = {}) {
  const n = list.length, g = new THREE.InstancedBufferGeometry(), q = quadGeo(); g.index = q.index; g.setAttribute('position', q.attributes.position); g.setAttribute('uv', q.attributes.uv);
  const A = new Float32Array(n * 4), B = new Float32Array(n * 2); list.forEach((f, i) => { A.set([...f.p, f.h ?? 0.06], i * 4); B.set([f.seed ?? i * 1.37, f.k ?? 1], i * 2); }); const aA = new THREE.InstancedBufferAttribute(A, 4), aB = new THREE.InstancedBufferAttribute(B, 2); g.setAttribute('aA', aA); g.setAttribute('aB', aB); g.instanceCount = n;
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uCol: { value: new THREE.Vector3(...color) }, uGain: { value: gain } }, vertexShader: `attribute vec4 aA; attribute vec2 aB; varying vec2 vUv, vB; void main() { vUv = uv; vB = aB; vec3 f = normalize(cameraPosition - aA.xyz), r = normalize(cross(vec3(0., 1., 0.), f)); gl_Position = projectionMatrix * viewMatrix * vec4(aA.xyz + (r * position.x * ${wide ? '1.9' : '1.35'} + vec3(0., 1., 0.) * position.y * 1.5) * aA.w, 1.); }`,
    fragmentShader: `varying vec2 vUv, vB; uniform float uTime, uGain; uniform vec3 uCol; ${GLSL_NOISE} void main() { float k = vB.y; if (k < .003) discard; float sc = mix(.35, 1., clamp(k, 0., 1.)); float yy = vUv.y * 1.5 / sc, x = (vUv.x - .5) * 3. / mix(.6, 1., sc); x -= (vn(vec2(yy * 1.7 - uTime * 3.1, vB.x)) - .5) * .5 * yy; float core;
      ${wide ? 'float n = fb(vec2(x * 1.9 + vB.x, yy * 1.6 - uTime * 1.9)), n2 = fb(vec2(x * 4.2 + vB.x, yy * 3. - uTime * 3.4)); float r = (1.05 - .75 * yy) * (.45 + .95 * n); core = smoothstep(r, r * .25, abs(x)) * smoothstep(1.15, .15, yy + .55 * (1. - n2)) * (.65 + .7 * n2);' : 'float r = .714 * pow(max(yy, 0.), .42) * pow(max(1. - yy, 0.), .75); core = smoothstep(r, r * .35, abs(x)) * smoothstep(1.02, .8, yy);'}
      float hot = core * core; vec3 c = mix(uCol * vec3(1., .55, .25), uCol, core) * core * 1.6 + vec3(1., .86, .58) * hot * 2.4; vec2 hv = vec2(x * .9, (yy - .4) * 1.1); c += uCol * exp(-dot(hv, hv) * 5.) * .10; gl_FragColor = vec4(c * uGain * clamp(k, 0., 2.), 1.); }` }));
  m.frustumCulled = false; m.renderOrder = 20; scene.add(m);
  return { mesh: m, set(i, k, p, h) { B[i * 2 + 1] = k; if (p) A.set(p, i * 4); if (h !== undefined) A[i * 4 + 3] = h; aA.needsUpdate = aB.needsUpdate = true; } };
}
// dust thrown up once, along the ground
export function puff(scene, { at, t0, n = 46, dir = null, spread = 1.1, size = 0.34, a = 0.16, color = [0.60, 0.48, 0.34], life = 2.2, seed = 3, up = 0.25 }) {
  const g = new THREE.InstancedBufferGeometry(), q = quadGeo(); q.translate(0, -0.5, 0); g.index = q.index; g.setAttribute('position', q.attributes.position); g.setAttribute('uv', q.attributes.uv); const A = new Float32Array(n * 4), B = new Float32Array(n * 2), aA = new THREE.InstancedBufferAttribute(A, 4), aB = new THREE.InstancedBufferAttribute(B, 2); g.setAttribute('aA', aA); g.setAttribute('aB', aB); g.instanceCount = n;
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uCol: { value: new THREE.Vector3(...color) } }, vertexShader: `attribute vec4 aA; attribute vec2 aB; varying vec2 vUv, vB; void main() { vUv = uv; vB = aB; vec3 f = normalize(cameraPosition - aA.xyz), r = normalize(cross(vec3(0., 1., 0.), f)), u = cross(f, r); gl_Position = projectionMatrix * viewMatrix * vec4(aA.xyz + (r * position.x + u * position.y) * aA.w, 1.); }`, fragmentShader: `varying vec2 vUv, vB; uniform vec3 uCol; ${GLSL_NOISE} void main() { float r = length(vUv - .5) * 2.; float n = fb(vUv * 2.6 + vB.y * 37.); gl_FragColor = vec4(uCol * (.8 + .4 * n), smoothstep(1., .1, r + .6 * (n - .5)) * vB.x * (.5 + n)); }` }));
  m.frustumCulled = false; m.renderOrder = 17; scene.add(m); const h = (k) => { const s = Math.sin(k * 127.1 + seed * 311.7) * 43758.5453; return s - Math.floor(s); };
  return { set(t) { const d = t - t0; m.visible = d > 0 && d < life; if (!m.visible) return; for (let i = 0; i < n; i++) { const p = typeof at === 'function' ? at(h(i + 50)) : at, th = dir ? dir + (h(i) - 0.5) * 1.6 : h(i) * 6.283, v = spread * (0.3 + 0.9 * h(i + 9)) * (1 - Math.exp(-d * 2.6)) , u = d / life; A.set([p[0] + Math.cos(th) * v, p[1] + 0.05 + up * (0.3 + h(i + 3)) * (1 - Math.exp(-d * 1.8)), p[2] + Math.sin(th) * v, size * (0.4 + 1.5 * Math.sqrt(u)) * (0.6 + 0.8 * h(i + 5))], i * 4); B[i * 2] = a * Math.min(1, d * 14) * Math.pow(1 - u, 1.5); B[i * 2 + 1] = h(i + 7); } aA.needsUpdate = aB.needsUpdate = true; } };
}
