// A clay slab with the old mark; water is poured across it and on "Abram" the mark is gone, the clay smooth.
export const kind = 'three';
import { shot, THREE, rise, ease } from '/song/lib/shot.js';
import { bench, at, K } from '/song/lib/sets.js';
import { rig } from '/kit/motion.js';
import { rng } from '/song/lib/noise.js';
export default shot('s10-no-longer', {
  sky: { hour: 'morning', az: -62, extent: 3, center: [0, 1, 3.4], gust: 0.4, el: 22 },
  build(S) {
    const R = bench(S, { jars: true, hearth: true, tint: 0.8, bseed: 14, bz: 3.4 }), y = R.top;
    const B = K.clayBed(S.scene, [0, y, 3.45], { w: 0.92, d: 0.36, h: 0.06, u: { uF: -0.7, uT2: 0 }, print: `vec2 q = vec2(cp.x * 3.4 + .5, cp.y / .26 + .5); float k = q.y > 0. && q.y < 1. ? sealOld(q) : 0.; float fr = uF + .035 * vn(vec2(cp.y * 30., uT2 * 3.)); float washed = smoothstep(.0, -.10, cp.x - fr); float wet = smoothstep(.05, -.02, cp.x - fr); k *= 1. - washed; h += top * (-.0105 * k); alb *= 1.5; alb *= 1. - .55 * k; float rip = sin(cp.x * 120. - uT2 * 40. + 6. * vn(cp * 22.)) * exp(-abs(cp.x - fr + .10) * 9.); h += .0016 * rip * wet; rough = mix(rough, .07, wet * .9); alb = mix(alb, alb * .72, wet);` });
    const J = K.jar(S.scene, [-0.56, y + 0.52, 3.38], { s: 0.62, seed: 5 }); K.jar(S.scene, [0.74, y, 3.2], { s: 0.5, seed: 7 }); const seal = K.sealMesh(S.scene, { now: 0 }); seal.g.position.set(0.50, y + 0.048, 3.72); seal.g.rotation.set(Math.PI / 2, 0, 0.5);
    const wm = new THREE.MeshPhysicalMaterial({ color: 0x9fb4b8, roughness: 0.04, transmission: 0, transparent: true, opacity: 0.42, depthWrite: false }); const T = K.liveTube(S.scene, wm, { n: 40, S: 10, r: 0.02 }); T.mesh.castShadow = false;
    const r = rng(5), ND = 120, dg = new THREE.SphereGeometry(1, 8, 6), dm = new THREE.InstancedMesh(dg, wm, ND), DR = [...Array(ND)].map(() => ({ a: r() * 6.283, v: 0.25 + 0.55 * r(), w: 0.5 + 0.8 * r(), ph: r(), s: 0.003 + 0.006 * r() })); dm.frustumCulled = false; S.scene.add(dm); const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), run = [0, 1, 2].map(() => K.liveTube(S.scene, wm, { n: 24, S: 8, r: 0.008 })); run.forEach((x) => { x.mesh.castShadow = false; });
    return { update(t) { R.hearth.set(t); const u = Math.min(1, Math.max(0, (t - 50.55) / 2.35)), u2 = 0.35 * ease.inOut3(u) + 0.65 * u, f = -0.46 + 1.04 * u2; B.m.userData.u.uF.value = f; B.m.userData.u.uT2.value = t; const pour = rise(t, 50.3, 0.3) * (1 - rise(t, 52.85, 0.25)); J.visible = false; const hx = f - 0.10, hy = y + 0.065, top = y + 1.25;
      T.set((q) => { const fall = q * q, lag = 0.24 * (1 - q); return [hx + 0.34 * (1 - q) * (1 - 0.35 * q) + 0.012 * Math.sin(q * 9 - t * 21) * q, top - (top - hy) * fall, 3.40 + 0.14 * lag + 0.014 * Math.sin(q * 11 - t * 26) * q]; }, Math.max(0, pour), (q) => Math.max(0.004, 0.024 - 0.012 * q + (0.004 + 0.004 * q) * Math.sin(q * 21 - t * 46))); T.mesh.visible = pour > 0.05;
      DR.forEach((d, i) => { const per = 0.34, e = ((t / per + d.ph) % 1) * per, yy = hy + d.w * e - 4.9 * e * e; m4.compose(new THREE.Vector3(hx + Math.cos(d.a) * d.v * e * 0.9, Math.max(hy - 0.01, yy), 3.40 + Math.sin(d.a) * d.v * e * 0.7), q4, new THREE.Vector3(1, 1, 1).multiplyScalar(d.s * pour)); dm.setMatrixAt(i, m4); }); dm.instanceMatrix.needsUpdate = true;
      run.forEach((x, i) => { const bx = [-0.22, 0.02, 0.27][i], on = Math.min(1, Math.max(0, (t - 50.9 - 0.55 * i) / 0.5)); x.set((q) => [bx + 0.012 * Math.sin(q * 6 + i), hy - 0.008 - 0.30 * Math.max(0, q - 0.35) - 0.02 * q, 3.59 + 0.10 * Math.min(1, q * 2.2)], Math.max(0.01, on), (q) => 0.010 - 0.004 * q); x.mesh.visible = on > 0.02 && t < 53.2; }); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.85, 1.26, 4.55], [0.5, 1.22, 4.45], [0.2, 1.20, 4.3]], look: [[0, 0.72, 3.42], [0, 0.72, 3.42], [0.05, 0.71, 3.42]], fov: [40, 36], enter: 'moving', exit: 'moving', handheld: 0.06, aperture: 0.007, focus: 1.1 }),
});
