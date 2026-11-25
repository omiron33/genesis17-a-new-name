// A bowl of water, trembling: as he speaks the rings die, and on "blameless" it is a clear mirror of the light.
export const kind = 'three';
import { shot, THREE, rise, g } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { M } from '/song/lib/core.js';
import { glory } from '/song/lib/fire.js';
import { rig } from '/kit/motion.js';
export default shot('s04-blameless', {
  sky: { hour: 'predawn', az: 170, moonAz: 300, moonEl: 32, extent: 5, center: [0, 1, 2], gust: 0.4, skyK: 1.4, sunK: 2.0, envK: 1.3 },
  build(S) {
    const R = bench(S, { bx: 0, bz: 2.2, hearth: { I: 14, smokeCol: [0.25, 0.25, 0.3] }, jars: true, tint: 0.62 }); const y = R.top;
    K.jar(S.scene, [0.02, y - 0.005, 2.28], { kind: 'bowl', s: 1.35, seed: 3 }); const wm = M('water', { env: 0.25, u: { uAmp: 0.004, uRef: 0 }, surf: `float r = length(p.xz); float w = 0.; for (int i = 0; i < 4; i++) { float fi = float(i); vec2 o = vec2(sin(fi * 2.1), cos(fi * 3.3)) * .092 * step(.5, fi); float d = length(p.xz - o); w += sin(d * (150. - 18. * fi) - uTime * (9. + fi)) * exp(-d * 4.); } h = uAmp * w * .35; vec2 q = p.xz + vec2(w, -w) * uAmp * 3.2; float wob = fb3(vec3(q * 9., uTime * .15)); vec3 sky = mix(vec3(.30, .20, .24), vec3(.52, .38, .34), smoothstep(-.25, .25, q.y)); float leaf = smoothstep(.46, .56, fb(vec3(q * 11., 2.)) + .42 * smoothstep(.02, -.22, q.y + .05 * q.x) - .18 * smoothstep(.07, .02, abs(q.x))); vec3 c = mix(sky, vec3(.030, .045, .022) + .05 * wob, leaf); for (int i = 0; i < 4; i++) { float fi = float(i), a = -1.0 + .62 * fi; vec2 dir = vec2(sin(a), -cos(a)); vec2 b = q - vec2(.0, .03); float t2 = clamp(dot(b, dir), 0., .24); c = mix(c, vec3(.035, .026, .02), smoothstep(.014 - .03 * t2, .004, length(b - dir * t2 - vec2(.02 * sin(t2 * 22. + fi), 0.)))); } float sh = exp(-pow((q.x - .12 * q.y) / .050, 2.)); c += vec3(1., .82, .48) * sh * (.25 + 1.15 * uRef) * (.75 + .25 * leaf); emit = c * .62; alb = vec3(.01); rough = .04;` }); const wd = K.mesh((() => { const gg = new THREE.CircleGeometry(0.262, 96); gg.rotateX(-Math.PI / 2); return gg; })(), wm, S.scene, [0.02, y + 0.150, 2.28]); wd.castShadow = false;
    K.jar(S.scene, [-0.62, y - 0.01, 2.05], { s: 0.50, seed: 5, rot: 0.7 }); K.jar(S.scene, [0.60, y - 0.01, 2.02], { kind: 'cup', s: 1.1, seed: 2 });
    const st = K.staff(S.scene, { p: at(0.95, 1.45) }); K.lean(st, 0.14, 3.0);
    const Gy = glory(S.scene, { from: [0.6, 12, -2.6], to: [0.02, y, 2.28], angle: 0.10, I: 900, air: 1.6 });
    return { update(t) { R.hearth.set(t); const still = 1 - rise(t, 21.2, 2.3); wm.userData.u.uAmp.value = 0.0055 * still * (1 + 0.6 * g(t, 20.3, 0.1, 0.1, 0.5)) + 0.00004; wm.userData.u.uRef.value = rise(t, 23.2, 0.7); Gy.set(t, 0.8 + 0.45 * rise(t, 23.1, 0.6)); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-0.95, 1.62, 3.5], [-0.40, 1.62, 3.42], [0.10, 1.62, 3.22]], look: [[0.0, 0.66, 2.3], [0.0, 0.66, 2.3], [0.02, 0.66, 2.3]], fov: [38, 34], enter: 'moving', exit: 'moving', handheld: 0.08, aperture: 0.007, focus: 1.45 }),
});
