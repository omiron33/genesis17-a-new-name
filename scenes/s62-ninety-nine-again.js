// The spiral of ninety-nine stones in the last light, a lamp set at its heart; the camera climbs.
export const kind = 'three';
import { shot, THREE, rise } from '/song/lib/shot.js';
import { camp, at, K, flames, flick } from '/song/lib/sets.js';
import { M } from '/song/lib/core.js';
import { instances } from '/song/lib/land.js';
import { rng } from '/song/lib/noise.js';
import { rig } from '/kit/motion.js';
export default shot('s62-ninety-nine-again', {
  sky: { hour: 'dusk', az: 255, moonAz: 70, moonEl: 30, extent: 8, center: [-0.6, 0.6, 3], gust: 0.35, skyK: 1.5, sunK: 2.6, envK: 1.25 },
  build(S) {
    const R = camp(S, { at: [-0.6, 3], n: 40000, r: 9, tents: 2, hearth: { I: 22, smokeCol: [0.2, 0.18, 0.22] }, jars: true, spots: [[-0.6, 3.0, 2.2]], flowers: 200 }), sc = S.scene; const spots = K.tallySpots([-0.6, 0, 3.0]), rad = spots.map(([x, , z]) => Math.hypot(x + 0.6, z - 3.0)), sm = M('paleStone', { uvless: true, u: { uFr: 0 }, vertHead: ' ', vert: 'vIH = length(instanceMatrix[3].xz - vec2(-.6, 3.));', surf: 'alb *= .50; float lit = smoothstep(uFr + .0015, uFr - .0015, ih); float edge = exp(-pow((ih - uFr) / .02, 2.)); emit = vec3(1., .66, .30) * (lit * .62 + edge * 1.2) * (.6 + .5 * n.y);' }); const rr = rng(6), sets = [[], []]; spots.forEach(([x, y, z], i) => { const s = 0.034 + 0.016 * rr(); sets[i % 2].push({ p: [x, y + s * 0.45, z], s: [s * 1.15, s, s], r: [(rr() - 0.5) * 0.6, rr() * 6.28, (rr() - 0.5) * 0.6] }); }); sets.forEach((q, i) => instances(sc, K.pebbleGeo(i), sm, q)); const st = K.staff(sc, { p: at(0.62, 1.72) }); K.lean(st, 0.04, 1); const lb = K.lampBody(sc, at(-0.6, 3.0), { s: 1.6, rot: 0.4 }), F = flames(sc, [{ p: lb.tip(), h: 0.20 }]), l = new THREE.PointLight(new THREE.Color(1, 0.6, 0.26), 0, 0, 2); const t0 = lb.tip(); l.position.set(t0[0], t0[1] + 0.12, t0[2]); l.castShadow = true; l.shadow.mapSize.set(1024, 1024); l.shadow.bias = -0.002; l.shadow.normalBias = 0.01; l.shadow.camera.near = 0.03; l.shadow.camera.far = 8; l.shadow.radius = 4; sc.add(l);
    return { update(t) { R.hearth.set(t); const k = rise(t, 297.45, 0.45), q = Math.min(1, Math.max(0, (t - 297.6) / 1.75)), ix = Math.min(98, q * 98.5), i0 = Math.floor(ix); sm.userData.u.uFr.value = t < 297.6 ? 0.05 : rad[i0] + (i0 < 98 ? (rad[i0 + 1] - rad[i0]) * (ix - i0) : 0.01); F.set(0, k * flick(t, 1)); l.intensity = 1.5 * k * flick(t, 1); } };
  },
  camera: (P) => rig({ from: P.from, to: P.to, path: [[0.3, 0.60, 5.0], [-0.1, 1.15, 4.9], [-0.5, 2.0, 4.5]], look: [[-0.5, 0.05, 2.9], [-0.55, -0.05, 2.95], [-0.6, -0.08, 3.0]], fov: [42, 40], enter: 'moving', exit: 'moving', handheld: 0.08 }),
});
