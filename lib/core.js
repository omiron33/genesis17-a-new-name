// The shared ground of every picture: light that averages over the sub-frames (a sun with a real
// disc, and an open sky that shades), air, and the physically based material factory. All code.
import * as THREE from 'three';
import { GLSL_NOISE } from '/song/lib/noise.js';

export const U = {
  uTime: { value: 0 }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uWind: { value: new THREE.Vector3(1, 0, 0.3) }, uGust: { value: 0.6 },
  uFogCol: { value: new THREE.Vector3(0.5, 0.6, 0.7) }, uFogSun: { value: new THREE.Vector3(0.6, 0.5, 0.3) }, uFogDen: { value: 0.0006 }, uFogH: { value: 0.012 },
};

// ---- chunk patches (each scene page loads its own three) ----
const C = THREE.ShaderChunk;
C.fog_pars_vertex = `#ifdef USE_FOG
varying vec3 vFogW;
#endif`;
C.fog_vertex = `#ifdef USE_FOG
{ vec4 fw = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
fw = instanceMatrix * fw;
#endif
vFogW = (modelMatrix * fw).xyz; }
#endif`;
C.fog_pars_fragment = `#ifdef USE_FOG
varying vec3 vFogW;
uniform vec3 uFogCol, uFogSun, uSunDir; uniform float uFogDen, uFogH;
#endif`;
C.fog_fragment = `#ifdef USE_FOG
{ vec3 fv = vFogW - cameraPosition; float fd = length(fv); vec3 fdir = fv / max(fd, 1e-4);
float x = fv.y * uFogH, f = abs(x) < 1e-3 ? 1.0 : (1.0 - exp(-x)) / x;
float od = uFogDen * fd * exp(-max(cameraPosition.y, 0.0) * uFogH) * f;
vec3 T = exp(-od * vec3(0.85, 1.0, 1.22));
vec3 fc = uFogCol + uFogSun * (0.55 * pow(max(dot(fdir, uSunDir), 0.0), 8.0) + 0.15 * max(dot(fdir, uSunDir), 0.0));
gl_FragColor.rgb = gl_FragColor.rgb * T + fc * (1.0 - T); }
#endif`;
C.lights_physical_pars_fragment = C.lights_physical_pars_fragment.replace('reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}',
  `reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
#ifdef ARK_TRANSL
  { float bl = saturate(-dot(geometryNormal, directLight.direction)) * 0.8 + 0.2 * pow(saturate(dot(-geometryViewDir, directLight.direction)), 4.0);
    reflectedLight.directDiffuse += uTransl * bl * directLight.color * BRDF_Lambert(pow(material.diffuseColor, vec3(0.8))); }
#endif
}`);

const SURF = {};
// each surf: void surf(vec3 p, vec3 n, vec2 uv, float ih, inout vec3 alb, inout float rough, inout float metal, inout float h, inout vec3 emit, float px)
SURF.plain = ``;
SURF.limestone = `
  float f = fb(p * 1.7 + ih * 31.), g = fb(p * 9. + ih * 7.); vec3 c = cell(p * 2.3 + f * 1.4);
  float pit = smoothstep(.62, .8, fb3(p * 24. + ih)), crack = smoothstep(.06, .0, abs(c.y - c.x)) * smoothstep(.45, .6, f);
  alb = mix(vec3(.47, .43, .36), vec3(.66, .61, .52), f) * (.75 + .5 * g);
  alb = mix(alb, vec3(.50, .40, .26), smoothstep(.55, .75, fb3(p * 3.1 + 9.)) * .5);
  float lich = smoothstep(.56, .66, fb(p * 5.2 + 40. + ih * 11.)) * smoothstep(-.1, .6, n.y); alb = mix(alb, vec3(.36, .35, .24) * (.8 + .5 * g), lich * .7);
  alb = mix(alb, vec3(.68, .45, .10), smoothstep(.70, .74, fb(p * 8. + 71. + ih * 5.)) * .5);
  alb *= 1. - .45 * pit - .55 * crack; alb = mix(alb, vec3(.30, .20, .11), smoothstep(.1, -.7, n.y) * .35); rough = .92; h = .016 * f + .008 * g - .005 * pit - .012 * crack;`;
SURF.paleStone = `
  float f = fb(p * 9. + ih * 31.), g = fb3(p * 60. + ih * 7.);
  alb = mix(vec3(.60, .56, .50), vec3(.82, .80, .75), f * .7 + .3 * fract(ih * 7.3)) * (.85 + .3 * g);
  alb = mix(alb, vec3(.55, .42, .30), smoothstep(.5, .8, fb3(p * 5. + ih * 90.)) * .35); rough = .7; h = .0012 * f + .0006 * g;`;
SURF.clay = `
  float f = fb(p * 6. + ih * 13.), g = fb3(p * 38.), ring = sin(p.y * 190. + 2. * f) * .5 + .5;
  alb = mix(vec3(.40, .17, .085), vec3(.60, .30, .16), f) * (.82 + .3 * g);
  alb = mix(alb, vec3(.16, .10, .07), smoothstep(.55, .8, fb3(p * 2.4 + ih * 21.)) * .55);
  alb = mix(alb, vec3(.62, .48, .36), smoothstep(.6, .8, fb3(p * 4.1 + 50.)) * .35);
  rough = .74 + .15 * g; h = .0009 * ring + .003 * f + .0008 * g;`;
SURF.wetClay = `
  float f = fb(p * 7.), g = fb3(p * 45.);
  alb = mix(vec3(.23, .145, .095), vec3(.33, .21, .14), f) * (.85 + .3 * g); rough = .34 + .22 * f; h = .0016 * f + .0005 * g;`;
SURF.wood = `
  vec3 q = vec3(p.x * 14., p.y * 1.6, p.z * 14.); float f = fb(q + ih * 9.), gr = fb(vec3(p.x * 90., p.y * 5., p.z * 90.) + 4. * f);
  vec3 kn = cell(vec3(p.x * 5., p.y * 3.4, p.z * 5.) + ih * 3.); float k = smoothstep(.30, .05, kn.x);
  alb = mix(vec3(.20, .12, .062), vec3(.46, .31, .17), f) * (.7 + .6 * gr); alb = mix(alb, vec3(.10, .055, .03), k * .8);
  rough = .58 + .2 * gr; h = .0022 * gr + .003 * f - .002 * k;`;
SURF.paleWood = `
  vec3 q = vec3(p.x * 14., p.y * 1.6, p.z * 14.); float f = fb(q + ih * 9.), gr = fb(vec3(p.x * 80., p.y * 5., p.z * 80.) + 4. * f);
  alb = mix(vec3(.34, .24, .14), vec3(.58, .45, .29), f) * (.7 + .6 * gr); rough = .6 + .2 * gr; h = .0016 * gr + .002 * f;`;
SURF.bark = `
  vec3 q = vec3(p.x * 3.2, p.y * .9, p.z * 3.2) + .5 * fb(p * 2.); vec3 c = cell(q * 1.4); float rid = smoothstep(.02, .42, c.y - c.x);
  float f = fb(p * 7.), g = fb(p * 26.);
  alb = mix(vec3(.085, .066, .050), vec3(.27, .225, .175), rid * .75 + .25 * f) * (.7 + .6 * g);
  alb = mix(alb, vec3(.20, .22, .10), smoothstep(.52, .70, fb(p * 1.3 + 7.)) * .55 * smoothstep(-.6, .5, n.x + .4 * n.y));
  rough = .95; h = .05 * rid * (.6 + .4 * f) + .012 * f + .006 * g;`;
SURF.hair = `
  // goat-hair cloth: long dark strips sewn together, each a little different
  float sx = uv.x * uStrips, s = floor(sx), e = abs(fract(sx) - .5) * 2.; float hue = nh1(vec2(s, 3.));
  float th = sin(uv.y * 900. + 3. * vn(vec2(uv.x * 80., uv.y * 12.))) * .5 + .5, th2 = sin(uv.x * 2600. * uStrips / 8.) * .5 + .5;
  float f = fb(vec2(uv.x * 60., uv.y * 9.));
  alb = mix(vec3(.075, .058, .047), vec3(.19, .145, .11), hue * .6 + .4 * f);
  alb = mix(alb, vec3(.40, .31, .215), step(.80, hue) * (.6 + .4 * f)); alb *= .7 + .5 * th * th2 + .25 * f; alb *= 1. - .35 * smoothstep(.93, 1., e);
  rough = .95; float ff = smoothstep(.004, .0006, px); h = (.0012 * th + .0009 * th2) * ff + .004 * f - .004 * smoothstep(.95, 1., e);`;
SURF.wool = `
  // a woven cloth: uv in threads; plain weave relief, uneven yarn, worn folds
  vec2 q = uv * uThreads; vec2 id = floor(q), fq = fract(q) - .5; float over = mod(id.x + id.y, 2.);
  float yarn = over > .5 ? (1. - abs(fq.x) * 1.7) * (.6 + .4 * cos(fq.y * 3.14)) : (1. - abs(fq.y) * 1.7) * (.6 + .4 * cos(fq.x * 3.14));
  float ff = smoothstep(.0035, .0008, px);
  float vx = vn(vec2(id.x * .31, uv.y * 9.)), vy = vn(vec2(uv.x * 9., id.y * .31)), f = fb(uv * 7.);
  alb = uCol * (.72 + .22 * vx + .22 * vy) * (.82 + .36 * f); alb *= mix(1., .68 + .42 * yarn, ff);
  #ifdef ARK_BORDER
    { float y = uv.y - .05; float band = step(y, uBorder) * step(uBorder * .30, y); float lines = step(.5, fract(uv.x * uBTeeth + abs(fract(y / uBorder * 2.) - .5)));
    float edge = step(y, uBorder * 1.15) * step(uBorder * 1.02, y) + step(y, uBorder * .28) * step(uBorder * .18, y);
    float g = clamp(band * lines + edge, 0., 1.) * uBorderOn; vec3 bc = uBorderCol * (.8 + .4 * vx);
    alb = mix(alb, bc, g); rough = mix(.9, uBorderMetal > .5 ? .34 : .85, g); metal = g * uBorderMetal * .75; emit += uBorderGlow * g * uBorderCol; }
  #endif
  if (uv.y < .05 && px < .02 && fract(uv.x * uThreads * .42 + .25 * sin(uv.y * 90. + floor(uv.x * uThreads * .42) * 2.)) > .62) discard;
  rough = max(rough, .34); h = (.0011 * yarn * ff + .0006 * vx + .0006 * vy) ;`;
SURF.rug = `
  float y = uv.y * uBands, s = floor(y), k = nh1(vec2(s, uSeed)); vec2 q = vec2(uv.x * 140., uv.y * 90.); float yarn = abs(sin(q.x * 3.14)) * .5 + abs(sin(q.y * 3.14)) * .5;
  float zig = step(.5, fract(uv.x * 14. + abs(fract(y) - .5) * 1.4)), tri = step(abs(fract(uv.x * 9. + .5 * mod(s, 2.)) - .5) * 2., fract(y));
  vec3 A = uColA, B = uColB, D = uColC; vec3 c = k < .3 ? A : k < .5 ? mix(A, D, zig) : k < .7 ? B : k < .85 ? mix(B, D, tri) : D;
  float f = fb(uv * vec2(30., 22.)); float ff = smoothstep(.0022, .0005, px); alb = c * (.7 + .5 * f) * mix(.93, .75 + .35 * yarn, ff);
  rough = .95; h = .0018 * yarn * ff + .002 * f;`;
SURF.basket = `
  vec2 q = uv * vec2(uThreads, uThreads * .55); vec2 id = floor(q), fq = fract(q) - .5; float o = mod(id.x + id.y, 2.);
  float strand = o > .5 ? sqrt(max(0., 1. - fq.y * fq.y * 3.6)) * (.75 + .25 * cos(fq.x * 3.14)) : .55 * sqrt(max(0., 1. - fq.x * fq.x * 3.9));
  float f = nh1(id + 3.), g = vn(vec2(uv.x * 400., uv.y * 60.));
  alb = mix(vec3(.30, .20, .09), vec3(.62, .46, .24), .35 * f + .5 * strand + .15 * g); alb *= .45 + .62 * strand; rough = .72; h = .006 * strand;`;
SURF.rope = `
  float tw = sin(uv.y * uTwist + uv.x * 6.2832 * 3.), f = vn(vec2(uv.x * 40. + uv.y * 30., uv.y * 400.)), g = fb3(p * 30.);
  alb = uCol * (.62 + .26 * tw + .34 * f) * (.8 + .4 * g); rough = .88; h = .0016 * tw + .0006 * f;`;
SURF.gold = `
  float f = fb3(p * 14.), g = vn(p * vec3(160., 420., 160.)); alb = mix(vec3(.86, .58, .20), vec3(1., .76, .36), f); metal = 1.; rough = .20 + .14 * g + .12 * f; h = .0006 * f + .00006 * g;`;
SURF.bronze = `
  float f = fb(p * 8.), g = vn(p * 220.); alb = mix(vec3(.30, .17, .07), vec3(.62, .38, .16), f); alb = mix(alb, vec3(.16, .25, .18), smoothstep(.55, .75, fb(p * 5. + 8.)) * .55); metal = .85; rough = .38 + .2 * f; h = .0012 * f + .0001 * g;`;
SURF.silver = `
  float f = fb3(p * 20. + ih * 9.), g = vn(p * 300.); alb = mix(vec3(.55, .55, .55), vec3(.86, .85, .82), f); metal = 1.; rough = .30 + .2 * f; h = .0012 * f + .0001 * g; alb *= .75 + .5 * smoothstep(.3, .6, f);`;
SURF.leather = `
  vec3 c = cell(p * 240.); float f = fb(p * 9. + ih * 5.); alb = mix(vec3(.15, .075, .035), vec3(.31, .17, .085), f) * (.75 + .3 * smoothstep(.0, .3, c.y - c.x)); rough = .55 + .2 * f; h = .0003 * smoothstep(.0, .3, c.y - c.x) + .003 * f;`;
SURF.leaf = `
  float v = abs(uv.x - .5) * 2.; float f = nh1(vec2(ih * 91., 2.)), vein = smoothstep(.05, .0, abs(v - .02)) + .35 * smoothstep(.08, .0, abs(fract(uv.y * 6. - v * 1.2) - .5) * .5);
  alb = mix(uColA, uColB, f) * (.85 + .3 * vn(uv * 9. + ih * 70.)); alb *= 1. + .25 * vein; rough = .74; h = 0.;`;
SURF.grain = `
  float v = abs(uv.x - .5); alb = mix(vec3(.50, .30, .10), vec3(.83, .60, .28), vn(uv * 5. + ih * 40.)) * (.75 + .4 * smoothstep(.0, .12, v)); rough = .5; h = .0003 * smoothstep(.1, 0., v);`;
SURF.fruit = `
  float f = fb(p * 22. + ih * 9.); alb = mix(vec3(.42, .035, .03), vec3(.78, .25, .10), smoothstep(.35, .75, f + .25 * n.y)); rough = .36; h = .0008 * f;`;
SURF.water = `alb = vec3(.012, .02, .02); rough = .03;`;

const uniformsOf = (o) => {
  const r = {};
  for (const [k, v] of Object.entries(o)) r[k] = { value: v instanceof Float32Array ? v : Array.isArray(v) ? (v.length === 2 ? new THREE.Vector2(...v) : new THREE.Vector3(...v)) : v };
  return r;
};
const DEFAULTS = { hair: { uStrips: 9 }, wool: { uThreads: 150, uCol: [0.5, 0.04, 0.03] }, rug: { uBands: 13, uSeed: 1, uColA: [0.36, 0.05, 0.035], uColB: [0.09, 0.055, 0.035], uColC: [0.62, 0.52, 0.36] }, basket: { uThreads: 60 }, rope: { uTwist: 300, uCol: [0.52, 0.43, 0.28] }, leaf: { uColA: [0.05, 0.10, 0.02], uColB: [0.12, 0.20, 0.04] } };
const DECL = { float: 'float', 2: 'vec2', 3: 'vec3' };

// M('clay', { u: { uCol: [...] }, side, transl, sheen, vert, vertHead, surf (extra GLSL after the kind), bump })
export function M(kind, o = {}) {
  const physical = o.sheen || o.clearcoat;
  const m = new (physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial)({ color: 0xffffff, roughness: 0.9, metalness: 0, side: o.side ?? THREE.FrontSide, vertexColors: !!o.vertexColors, flatShading: !!o.flat });
  if (o.sheen) { m.sheen = o.sheen; m.sheenRoughness = 0.55; m.sheenColor = new THREE.Color(...(o.sheenColor ?? [1, 1, 1])); }
  if (o.clearcoat) { m.clearcoat = o.clearcoat; m.clearcoatRoughness = o.ccRough ?? 0.2; }
  if (o.transparent) { m.transparent = true; m.opacity = o.opacity ?? 1; m.depthWrite = o.depthWrite ?? false; }
  if (o.env !== undefined) m.envMapIntensity = o.env;
  const own = uniformsOf({ ...(DEFAULTS[kind] ?? {}), ...(o.u ?? {}) });
  m.userData.u = own;
  m.defines = { ...m.defines };
  if (o.transl) { m.defines.ARK_TRANSL = ''; own.uTransl = { value: o.transl }; }
  if (o.border) { m.defines.ARK_BORDER = ''; Object.assign(own, uniformsOf({ uBorder: 0.16, uBTeeth: 22, uBorderOn: 1, uBorderCol: [0.86, 0.62, 0.24], uBorderMetal: 1, uBorderGlow: 0, ...o.border })); }
  const decl = Object.entries(own).map(([k, v]) => v.value instanceof Float32Array ? `uniform vec4 ${k}[${v.value.length / 4}];` : `uniform ${v.value?.isVector3 ? 'vec3' : v.value?.isVector2 ? 'vec2' : v.value?.isTexture ? 'sampler2D' : 'float'} ${k};`).join('\n');
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, U, own);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP, vON; varying vec2 vOUV; varying float vIH; uniform float uTime, uGust; uniform vec3 uWind;\n${o.vertHead ? GLSL_NOISE : ''}${decl}\n${o.vertHead ?? ''}`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\n${o.vertNormal ?? ''}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvOP = position; vON = normal; vOUV = ${o.uvless ? 'vec2(0.)' : 'uv'}; vIH = 0.;
#ifdef USE_INSTANCING
{ vec3 iq = fract(instanceMatrix[3].xyz * .1031 + .37); iq += dot(iq, iq.zyx + 31.32); vIH = fract((iq.x + iq.y) * iq.z); }
#endif
${o.vert ?? ''}`);
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vOP, vON; varying vec2 vOUV; varying float vIH;\nuniform float uTime;\n${GLSL_NOISE}\n${decl}\nvec3 sfEmit; float sfRough, sfMetal, sfH;\n${o.fragHead ?? ''}
void surf(vec3 p, vec3 n, vec2 uv, float ih, inout vec3 alb, inout float rough, inout float metal, inout float h, inout vec3 emit, float px) {\n${SURF[kind]}\n${o.surf ?? ''}\n}`)
      .replace('#include <color_fragment>', `sfEmit = vec3(0.); sfRough = roughness; sfMetal = metalness; sfH = 0.;
{ float px = length(fwidth(vOP)); surf(vOP, normalize(vON), vOUV, vIH, diffuseColor.rgb, sfRough, sfMetal, sfH, sfEmit, px); }
#include <color_fragment>`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = clamp(sfRough, .03, 1.);')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = sfMetal;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
{ vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition); float hx = dFdx(sfH), hy = dFdy(sfH);
  vec3 R1 = cross(dpy, normal), R2 = cross(normal, dpx); float det = dot(dpx, R1) * faceDirection; vec3 gr = sign(det) * (hx * R1 + hy * R2) * ${(o.bump ?? 1).toFixed(3)};
  float nv = saturate(dot(normal, normalize(vViewPosition))); gr *= smoothstep(.02, .45, nv); float gln = length(gr), lim = abs(det) * 0.85; if (gln > lim) gr *= lim / gln; normal = normalize(abs(det) * normal - gr); }`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += sfEmit;');
  };
  const key = kind + JSON.stringify([o.surf, o.vert, o.vertHead, o.vertNormal, o.fragHead, o.bump, Object.keys(own), o.uvless]);
  m.customProgramCacheKey = () => key;
  return m;
}

// where in the shutter this sub-frame sits, 0..1 (the engine averages sub-frames over half a frame)
export function subFrame(t, fps = 60, shutter = 0.5) { const x = t * fps; return Math.min(0.999, Math.max(0, (x - Math.round(x)) / shutter + 0.5)); }
// the sun: a disc, sampled once per sub-frame; the open sky: one shadowed direction per sub-frame
export class Light {
  constructor(scene, { dir, color, intensity, sky, skyI, extent = 14, center = [0, 1, 0], disc = 0.022, map = 2048, skyMap = 1024 }) {
    this.center = new THREE.Vector3(...center); this.disc = disc; this.extent = extent;
    const mk = (size, rad) => { const l = new THREE.DirectionalLight(0xffffff, 1); l.castShadow = true; l.shadow.mapSize.set(size, size); const c = l.shadow.camera; c.left = c.bottom = -extent; c.right = c.top = extent; c.near = 28; c.far = 118; l.shadow.bias = -0.00008; l.shadow.normalBias = extent / size * 3.6; l.shadow.radius = rad * 1.4; scene.add(l, l.target); return l; };
    this.sun = mk(map, 1.6); this.sky = mk(skyMap, 3.0);
    this.sun.color.setRGB(...color); this.sun.intensity = intensity; this.sky.color.setRGB(...sky); this.sky.intensity = skyI; this.skyI = skyI;
    this.dir = new THREE.Vector3(...dir).normalize(); this.v = new THREE.Vector3();
  }
  at(t) {
    const u = subFrame(t), th = 2 * Math.PI * ((u * 13.6) % 1), r = Math.sqrt(u);
    const d = this.dir, a = new THREE.Vector3(d.z, 0, -d.x); if (a.lengthSq() < 1e-6) a.set(1, 0, 0); a.normalize(); const b = new THREE.Vector3().crossVectors(d, a);
    const v = this.v.copy(d).addScaledVector(a, Math.cos(th) * r * this.disc).addScaledVector(b, Math.sin(th) * r * this.disc).normalize();
    this.sun.position.copy(this.center).addScaledVector(v, 70); this.sun.target.position.copy(this.center);
    const ph = 2 * Math.PI * ((u * 9.89 + 0.31) % 1), z = Math.sqrt(1 - 0.88 * ((u * 7.3 + 0.2) % 1));   // cosine-ish hemisphere
    const s = Math.sqrt(Math.max(0, 1 - z * z));
    this.sky.position.copy(this.center).add(this.v.set(Math.cos(ph) * s, z, Math.sin(ph) * s).multiplyScalar(70)); this.sky.target.position.copy(this.center);
    U.uSunDir.value.copy(this.airDir ?? this.dir);
  }
}
