// Over the staff to the valley: on ridge after ridge bright standards go up and take the wind.
export const kind = 'three';
import { shot, THREE, br } from '/song/lib/shot.js';
import { camp, at, G, K } from '/song/lib/sets.js';
import { M } from '/song/lib/core.js';
import { rng, n2 } from '/song/lib/noise.js';
import { sheet, clothMesh, woolMat } from '/song/lib/cloth.js';
import { rig, spring } from '/kit/motion.js';
export default shot('s09-multitude', {
  sky: { hour: 'morning', az: 60, extent: 9, center: [2, 1, 8], gust: 0.8, el: 16 },
  build(S, P) {
    const R = camp(S, { at: [2, 9], n: 52000, r: 11, tents: 1, oak: false, flowers: 500, paths: [[2, 8, 8, 40, 1]] }); const st = K.staff(S.scene, { p: at(1.6, 9.2) }); K.lean(st, 0.06, 2);
    const COLS = [[0.40, 0.055, 0.035], [0.56, 0.36, 0.09], [0.055, 0.08, 0.24], [0.60, 0.54, 0.41], [0.10, 0.20, 0.13], [0.24, 0.07, 0.14], [0.50, 0.22, 0.07]];
    // near standards: real cloth
    const near = [[-1.8, 12.6, 2, 44.9], [4.4, 13.0, 0, 45.4], [-4.2, 16.0, 5, 45.9], [6.8, 17.0, 1, 46.3], [1.4, 17.5, 3, 46.6]].map(([x, z, c, t0], i) => { const y = G(x, z), H = 3.2; const up = (t) => spring(t, t0, { freq: 1.1, damping: 0.5 }); const pole = K.mesh(K.sweep([K.V(0, -0.3, 0), K.V(0.02, 1.6, 0), K.V(0, H, 0)], 0.028, { S: 9 }), K.mat('wood'), S.scene, [x, y, z]); const bar = K.mesh(K.sweep([K.V(-0.02, H - 0.05, 0), K.V(1.2, H - 0.02, 0)], 0.018, { S: 7 }), K.mat('wood'), pole);
      const sh = sheet({ w: 1.1, h: 1.9, nx: 18, ny: 28, t0: P.from - 1.2, seed: i + 2, iter: 10, rest: (u, v) => [x + 0.06 + u * 1.1, y + H * 0.08 - v * 0.2, z + v * 0.3], pin: (a, b) => (b === 0 ? (t) => [x + 0.06 + a / 17 * 1.1, y + H * (0.10 + 0.90 * up(t)) - 0.07, z] : null), wind: (t) => [1.4 * br(t + i), 0, 2.6 * br(t + i * 2)], ground: G }); const cm = clothMesh(S.scene, sh, woolMat(COLS[c], { threads: 110, border: { uBorder: 0.1, uBorderMetal: 0, uBorderCol: COLS[(c + 3) % 7], uBTeeth: 8 } })); return { set(t) { cm.set(t); pole.position.y = y - H * 0.9 * (1 - up(t)); } }; });
    // far standards: hundreds, waving in the shader
    const g = new THREE.PlaneGeometry(1, 1, 8, 12); g.translate(0.5, -0.5, 0); const r = rng(6), n = 1500, list = [];
    let tr = 0; while (list.length < n && tr++ < 20000) { const d = 26 + 680 * Math.pow(r(), 1.2), a = (r() - 0.5) * 1.5 + 0.02, x = 2 + Math.sin(a) * d, z = 8 + Math.cos(a) * d; if (n2(x * 0.025, z * 0.025 + 3) < 0.5) continue; list.push([x, z, d, r()]); }
    const mat = M('plain', { side: THREE.DoubleSide, transl: 0.6, vertHead: ' ', vert: 'float wv = sin(position.y * 5. + uTime * 5. + vIH * 20. - position.x * 2.) * .16 * -position.y + sin(uTime * 3.1 + vIH * 40.) * .05; transformed.z += wv + .35 * position.y * position.y; transformed.y *= .96;', surf: 'alb *= .75 + .4 * vn(uv * 30.); rough = .9;' });
    const im = new THREE.InstancedMesh(g, mat, n), pg = new THREE.CylinderGeometry(0.03, 0.04, 1, 6); pg.translate(0, 0.5, 0); const pm = new THREE.InstancedMesh(pg, K.mat('wood'), n); const col = new Float32Array(n * 3); list.forEach((q, i) => { const c = COLS[Math.floor(q[3] * 6.99)]; col.set(c, i * 3); }); im.instanceColor = new THREE.InstancedBufferAttribute(col, 3); for (const o of [im, pm]) { o.frustumCulled = false; o.castShadow = false; o.receiveShadow = true; S.scene.add(o); }
    const m = new THREE.Matrix4(), Q = new THREE.Quaternion(), V = (x, y, z) => new THREE.Vector3(x, y, z);
    return { update(t) { near.forEach((o) => o.set(t)); list.forEach(([x, z, d, h], i) => { const k = spring(t, 45.6 + 2.6 * Math.pow(d / 640, 0.55) + 0.5 * h, { freq: 1.0, damping: 0.5 }), H = 4.2 + 2.2 * h, y = G(x, z); m.compose(V(x, y - 0.2, z), Q, V(1.6, Math.max(0.001, H * k), 1.6)); pm.setMatrixAt(i, m); m.compose(V(x, y + H * k, z), Q, V(1.5 * Math.max(0.001, k), 3.4 * Math.max(0.001, k), 1)); im.setMatrixAt(i, m); }); im.instanceMatrix.needsUpdate = pm.instanceMatrix.needsUpdate = true; } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.6, 1.2, 5.6], [0.3, 1.9, 5.2], [0.0, 3.2, 4.4]], look: [[2.0, 1.8, 20], [2.0, 1.4, 20], [1.6, 0.5, 22]], fov: 48, enter: 'moving', exit: 'moving', handheld: 0.15 }),
});
