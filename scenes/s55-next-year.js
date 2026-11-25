// A year goes over the oak: gold leaf, bare bough, blossom, green; below it the cradle waits by the red cloth.
export const kind = 'three';
import { shot, THREE, br, ease } from '/song/lib/shot.js';
import { keys } from '/engine.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { hang, clothMesh, woolMat, COL } from '/song/lib/cloth.js';
import { leafMat, sprigGeo, oakNodes, leafSpots } from '/song/lib/tree.js';
import { instances } from '/song/lib/land.js';
import { M } from '/song/lib/core.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s55-next-year', {
  sky: { hour: 'golden', az: 112, extent: 13, center: [0, 3, -3], gust: 0.6, el: 16 },
  build(S, P) {
    const R = camp(S, { at: [0, 2], n: 50000, r: 11, tents: 1, jars: true, oak: false, flowers: 300 }), sc = S.scene; const { oak } = S; const sets = R;
    const lm = { u: { uShow: 1, uGold: 0, uFresh: 0 }, show: 'smoothstep(vIH * .82, vIH * .82 + .14, uShow)', surf: 'vec3 go = mix(vec3(.52, .24, .04), vec3(.78, .50, .10), f); go = mix(go, vec3(.50, .12, .03), step(.7, f) * .6); alb = mix(alb, go * (.8 + .4 * vn(uv * 9. + ih * 70.)), clamp(uGold * 1.5 - .5 * ih, 0., 1.)); alb = mix(alb, vec3(.26, .38, .08) * (.8 + .4 * f), uFresh * .7);' };
    return import('/song/lib/tree.js').then(({ oak }) => { const O = oak(sc, { at: [0, -0.05, -6], leaf: lm }); const r = rng(4); const nodes = oakNodes(); const spots = leafSpots(nodes, { maxR: 0.026, per: 7, jitter: 0.26, size: [0.7, 1.4], seed: 9 }); const bg = new THREE.PlaneGeometry(0.085, 0.085, 1, 1), bg2 = bg.clone().rotateY(1.57); const P5 = []; const geo = sprigGeo(5, { L: 0.085, W: 0.042, spread: 1.0, curl: 0.1 }); const bm = leafMat({ colA: [0.80, 0.62, 0.60], colB: [0.92, 0.86, 0.82], transl: 0.8, u: { uShow: 0 }, show: 'smoothstep(vIH * .6, vIH * .6 + .3, uShow)' }); instances(sc, geo, bm, spots.map((s) => ({ ...s, p: [s.p[0], s.p[1] - 0.05, s.p[2] - 6] })));
      // leaves let go and fall
      const fl = instances(sc, sprigGeo(1, { L: 0.11, W: 0.036 }), M('plain', { side: THREE.DoubleSide, transl: 0.9, surf: 'alb = mix(vec3(.52, .22, .04), vec3(.80, .50, .10), ih);' }), [...Array(420)].map(() => ({ p: [0, -9, 0] }))); const F = [...Array(420)].map(() => ({ x: (r() - 0.5) * 14, z: -6 + (r() - 0.5) * 11, h: 2.8 + 4.5 * r(), t0: 265.9 + 1.7 * r(), e: r() * 6, v: 1.0 + 0.7 * r() })); const m = new THREE.Matrix4(), q = new THREE.Quaternion();
      const y = G(1.6, 2.4); K.line(sc, [0.5, y + 1.95, 2.7], [3.1, y + 1.95, 2.2], { sag: 0.04 }); const C = hang({ a: [0.8, y + 1.92, 2.64], b: [2.7, y + 1.92, 2.28], h: 1.35, nx: 34, ny: 30, t0: P.from - 2.5, seed: 4, ground: G, wind: (t) => [1.2 * br(t), 0, 1.0 * br(t + 2)] }), cm = clothMesh(sc, C, woolMat(COL.red, { border: { uBorder: 0.16, uBTeeth: 16 }, transl: 0.7 })); const cr = K.cradle(sc, at(-0.9, 3.0), { rot: 0.3, s: 1.5, hoop: true }); const st = K.staff(sc, { p: at(-2.3, 2.0) });
      return { update(t) { cm.set(t); const u = O.mat.userData.u; u.uGold.value = keys(t, [[264.9, 0], [266.2, 1]]); u.uShow.value = keys(t, [[265.8, 1], [267.2, 0], [269.4, 0], [270.9, 1]]); u.uFresh.value = keys(t, [[268, 0], [269, 1], [271.9, 0.35]]); if (t > 268.3) u.uGold.value = 0; bm.userData.u.uShow.value = keys(t, [[267.9, 0], [268.9, 1], [270.2, 1], [271.3, 0]]);
        F.forEach((f, i) => { const d = t - f.t0; const yy = Math.max(0.02, f.h - f.v * Math.max(0, d)); const ok = d > 0 && d < 9 && t < 269.6; q.setFromEuler(new THREE.Euler(f.e + (yy > 0.03 ? d * 2.5 : 0), f.e + (yy > 0.03 ? d * 1.7 : 0), 0.3)); const x = f.x + 0.35 * Math.sin(d * 2.2 + f.e) + 0.35 * d * (yy > 0.03 ? 1 : 0); m.compose(new THREE.Vector3(x, G(x, f.z) + yy, f.z + 0.2 * Math.cos(d * 1.9 + f.e)), q, new THREE.Vector3(1, 1, 1).multiplyScalar(ok ? (t > 268.6 ? Math.max(0.001, 269.6 - t) : 1) : 0.0001)); fl.setMatrixAt(i, m); }); fl.instanceMatrix.needsUpdate = true;
        cr.rock(0.06 * Math.sin(t * 3)); const snow = keys(t, [[267.2, 0], [268.0, 1], [268.9, 0]]); sc.environmentIntensity = 0.9 * (1 - 0.12 * snow); } }; });
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[-3.2, 1.3, 9.4], [-1.2, 1.7, 9.6], [1.4, 2.0, 9.2]], look: [[0.2, 2.9, -3], [0.2, 2.9, -3], [0.2, 2.9, -3]], fov: [52, 52], enter: 'moving', exit: 'moving', handheld: 0.1 }),
});
