// One shot: builds the scene, keeps the sub-frame light, gives every scene the same finish.
//   export default shot('s05-cord', { sky: {...}, post: {...}, build(S) { ... return { update(t) } }, camera: (P) => rig(...) })
import * as THREE from 'three';
import { makeSky } from '/song/lib/sky.js';
import { grade } from '/song/lib/look.js';
import { U } from '/song/lib/core.js';
import { ease, clamp01 } from '/engine.js';
import { fractal } from '/kit/motion.js';

export { THREE, ease, clamp01 };
// a breeze that never repeats; one gust; a lasting rise; a hanging thing ringing after a push
export const br = (t) => 0.6 + 0.5 * fractal(t * 0.45, { seed: 3, octaves: 3 }) + 0.25 * fractal(t * 1.4, { seed: 8, octaves: 2 });
export const g = (t, t0, up, hold, down) => (t < t0 ? 0 : t < t0 + up ? ease.inOut3((t - t0) / up) : t < t0 + up + hold ? 1 : Math.exp(-(t - t0 - up - hold) / (down * 0.45)));
export const rise = (t, t0, d) => ease.inOut3((t - t0) / d);
export const ring = (t, t0, f, d) => (t < t0 ? 0 : Math.sin(2 * Math.PI * f * (t - t0)) * Math.exp(-d * (t - t0)));
export const shot = (name, o) => (P) => {
  const S = { P, x: (t) => clamp01((t - P.from) / (P.to - P.from)) }; let upd = null;
  const cam = o.camera(P, S);
  return {
    name, from: P.from, to: P.to,
    async build({ renderer }) {
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.shadowMap.autoUpdate = true;
      const scene = new THREE.Scene(); S.scene = scene; S.renderer = renderer;
      S.sky = makeSky(scene, renderer, o.sky); U.uGust.value = o.sky.gust ?? 0.5; U.uWind.value.set(...(o.sky.wind ?? [0.95, 0, 0.3]));
      // a graduated filter over the foot of the frame, as a camera would carry, so the words have ground to sit on
      { const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, transparent: true, blending: THREE.CustomBlending, blendEquation: THREE.AddEquation, blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcColorFactor, uniforms: { uG: { value: o.grad ?? 0.5 } }, vertexShader: 'varying float vY; void main() { vY = uv.y; gl_Position = vec4(position.xy, 0., 1.); }', fragmentShader: 'varying float vY; uniform float uG; void main() { float k = smoothstep(.0, .40, vY); gl_FragColor = vec4(vec3(mix(1. - uG, 1., k)) * mix(vec3(.94, .96, 1.), vec3(1.), k), 1.); }' })); q.frustumCulled = false; q.renderOrder = 100; scene.add(q); S.gradQ = q; }
      const b = await o.build(S, P); upd = b?.update ?? (typeof b === 'function' ? b : null);
      return { scene };
    },
    camera: (t) => ({ near: o.near ?? 0.05, far: 6000, aperture: 0, ...cam(t) }),
    update(t) { S.cam = cam(t); upd?.(t, S); S.sky.update(t); },
    post: (t) => grade(t, { exposure: (S.sky?.H.exposure ?? 1) * (o.exposure ?? 1), ...(typeof o.post === 'function' ? o.post(t, S) : o.post ?? {}) }),
    finish: (t) => o.finish?.(t, S) ?? { grade: { shadows: [0.012, 0.016, 0.03], highlights: [1.0, 0.97, 0.91], amount: 0.35 } },
  };
};
