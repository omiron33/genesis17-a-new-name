// The land of Chanaan opens from above; a wave of light runs out over it; one small tent on the hill.
export const kind = 'three';
import { shot, THREE, ease } from '/song/lib/shot.js';
import { land, shrubs, bareField, height } from '/song/lib/land.js';
import { K, at, G } from '/song/lib/sets.js';
import { oak } from '/song/lib/tree.js';
import { M } from '/song/lib/core.js';
import { rig } from '/kit/motion.js';
export default shot('s19-all-the-land', {
  sky: { hour: 'morning', az: 245, extent: 60, center: [0, 4, 0], gust: 0.5, el: 18, fogK: 0.45, cover: 0.42 }, near: 0.5,
  build(S) {
    const sc = S.scene; const L = land(sc, { center: [0, 0], nr: 380, na: 520, rMax: 5200, u: { uFr: 0 }, surf: `float rd = rr + 30. * (vn(w * .02) - .5); float wv = exp(-pow((rd - uFr) / (26. + uFr * .12), 2.)); float past = smoothstep(0., -60., rd - uFr); alb *= .72 + .38 * past; alb = mix(alb, alb * vec3(1.02, 1.12, .86), past * .5); emit = vec3(1., .78, .40) * wv * (.5 + alb * 2.6);
      float wb = 34. * sin(w.y * .006) + 60. * sin(w.y * .0021 + 2.) + 170.; float rv = abs(w.x - wb); ` });
    shrubs(sc, { far: [26, 900, 3600], fs: 0.6 }); oak(sc, { at: at(0, -6) }); for (const [x, z, r, w] of [[-9.2, -3.6, 0.42, 7.4]]) K.tent(sc, { p: at(x, z), rot: r, w });
    const sea = new THREE.Mesh(new THREE.CircleGeometry(5200, 120), M('water', { env: 1.1, uvless: true, surf: 'alb = vec3(.02, .06, .09); rough = .10; h = .04 * vn(p.xy * .6) * 0.;' })); sea.rotation.x = -Math.PI / 2; sea.position.y = -33; sea.receiveShadow = false; sc.add(sea);
    return { update(t) { L.mat.userData.u.uFr.value = -20 + 1300 * Math.pow(Math.max(0, (t - 86.9) / 3.3), 1.9); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-8, 4.5, 24], [-5, 9, 31], [2, 18, 40]], look: [[0, 4, -20], [1, 5, -60], [3, 5, -110]], fov: [50, 52], enter: 'moving', exit: 'moving', handheld: 0.1, bank: 0.2 }),
});
