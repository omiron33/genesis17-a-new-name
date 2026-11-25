// The words of Genesis 17, as their own sharp layer over the picture, set on a plane placed in the
// world (standing at a point in the land, or lying on the ground) so they move with the scene.
// Two typefaces: EB Garamond for every sung word, Inter Tight for the small annotation. The narrator is
// roman; Abraam is italic; the Lord speaks in small capitals in the signal colour.
import { ease, clamp01 } from '/engine.js';
import lyrics from '/timing.js';
import { SIGNAL, BONE } from '/song/lib/look.js';

const ABRAM = '244, 230, 200';
// who opens each quotation, by lyric line index: g God, a Abraam
const QUOTE = { 51: 'a', 55: 'a' };
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]/g, '').trim();
const LINES = lyrics.lines.map((l, i) => ({ ...l, i, words: lyrics.words.filter((w) => w.start >= l.start - 0.05 && w.end <= l.end + 0.05) }));
// speaker of every word
{
  let inQ = false, who = 'n';
  for (const L of LINES) {
    for (const w of L.words) {
      if (w.w.includes('“')) { inQ = true; who = QUOTE[L.i] ?? 'g'; }
      w.v = inQ ? who : 'n';
      if (w.w.includes('”')) inQ = false;
    }
    if (L.words.length) L.words[L.words.length - 1].last = true;
  }
}
export function lines(...prefixes) { return linesFrom(0, ...prefixes); }
export function linesFrom(t0, ...prefixes) {
  let from = t0;
  return prefixes.map((p) => {
    const l = LINES.find((l) => l.start >= from && norm(l.text).startsWith(norm(p)));
    if (!l) throw Error('no line: ' + p);
    from = l.start;
    return l;
  });
}

const clean = (s, last) => { s = s.replace(/'/g, '’').replace(/[“”"]/g, ''); return last ? s.replace(/[,;:.]+$/, '') : s.replace(/[;:]+$/, ','); };
function voice(v, px) {
  if (v === 'g') return { font: `600 ${Math.round(px * 0.98)}px "EB Garamond"`, caps: 'all-small-caps', track: 0.07 * px, color: SIGNAL };
  const who = { a: ABRAM }[v];
  if (who) return { font: `italic 500 ${px}px "EB Garamond"`, caps: 'normal', track: -0.005 * px, color: who };
  return { font: `500 ${px}px "EB Garamond"`, caps: 'normal', track: -0.01 * px, color: BONE };
}
function measure(ctx, w, px) {
  const v = voice(w.v, px);
  ctx.font = v.font; ctx.fontVariantCaps = v.caps; ctx.letterSpacing = `${v.track}px`;
  return ctx.measureText(clean(w.w, w.last)).width + (w.v !== 'n' && w.v !== 'g' ? px * 0.06 : 0);
}

// Set lines word by word, each word arriving on its measured start. Lines are centred (or
// left-aligned) and auto-fit to `maxW` canvas pixels. `ink` overrides the voice colours for a dark
// ink on a bright surface.
export function setLines(ctx, L, t, { x = 1920, y = 640, size = 150, lead = 1.28, maxW = 3500, align = 'center', ink, fadeOut } = {}) {
  ctx.textBaseline = 'alphabetic';
  let px = size;
  const space = () => px * 0.27;
  const widthOf = (l) => l.words.reduce((a, w) => a + measure(ctx, w, px), 0) + space() * (l.words.length - 1);
  const widest = Math.max(...L.map(widthOf));
  if (widest > maxW) px = Math.floor(px * maxW / widest);
  const out = fadeOut ? 1 - ease.inOut3((t - fadeOut[0]) / (fadeOut[1] - fadeOut[0])) : 1;
  const total = (L.length - 1) * px * lead;
  L.forEach((l, li) => {
    const W = widthOf(l);
    let cx = align === 'center' ? x - W / 2 : x;
    const cy = y - total / 2 + li * px * lead;
    for (const w of l.words) {
      const ww = measure(ctx, w, px);
      const k = ease.out3((t - w.start + 0.04) / 0.32);
      if (k > 0.001 && out > 0.001) {
        const v = voice(w.v, px);
        ctx.font = v.font; ctx.fontVariantCaps = v.caps; ctx.letterSpacing = `${v.track}px`;
        ctx.fillStyle = `rgba(${ink ?? v.color}, ${(Math.min(1, k * 1.6) * out).toFixed(3)})`;
        ctx.fillText(clean(w.w, w.last), cx, cy + (1 - k) * px * 0.16);
      }
      cx += ww + space();
    }
  });
  ctx.fontVariantCaps = 'normal'; ctx.letterSpacing = '0px';
}

// The annotation: GENESIS 16:v with a small four-pointed star in the signal colour.
export function gauge(ctx, text, x, y, { size = 54, alpha = 0.8, align = 'center', ink = BONE } = {}) {
  ctx.font = `500 ${size}px "Inter Tight"`;
  ctx.letterSpacing = `${size * 0.3}px`;
  const w = ctx.measureText(text).width;
  const x0 = align === 'center' ? x - w / 2 : x;
  ctx.fillStyle = `rgba(${ink}, ${alpha})`;
  ctx.fillText(text, x0, y);
  const sx = x0 - size * 0.9, sy = y - size * 0.36, r = size * 0.42;
  ctx.fillStyle = `rgba(${SIGNAL}, ${alpha})`;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r * 0.28 : r; ctx.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill();
  ctx.letterSpacing = '0px';
}

// The title card: A NEW NAME large, GENESIS 17 small below, in the lyric face, bone with the signal star. a: annotation, b: title, out: fade.
export function titleCard(ctx, H, a, b, out = 1) {
  if (a > 0.001) gauge(ctx, 'GENESIS 17', 1920, H * 0.82, { size: 128, alpha: 0.95 * a * out });
  if (b > 0.001) {
    const T = 'A NEW NAME';
    let px = 400;
    ctx.font = `500 ${px}px "EB Garamond"`; ctx.letterSpacing = `${px * 0.12}px`;
    px = Math.floor(px * 2900 / ctx.measureText(T).width);
    ctx.font = `500 ${px}px "EB Garamond"`; ctx.letterSpacing = `${px * 0.12}px`;
    const w = ctx.measureText(T).width;
    ctx.fillStyle = `rgba(${BONE}, ${(b * out).toFixed(3)})`;
    ctx.fillText(T, 1920 - w / 2 + px * 0.06, H * 0.56 + (1 - b) * px * 0.08);
    ctx.letterSpacing = '0px';
  }
}

// ---- planes in the world ----
const sub = (a, b) => a.map((v, i) => v - b[i]);
const nrm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// An upright plane standing at world point c, turned to face the camera position `from` (the
// scene's opening camera), `frac` of the screen width wide as seen from there.
export function standing(c, from, frac, aspect = 3, { tilt = 0 } = {}) {
  const d = sub(c, from.pos);
  const dist = Math.hypot(...d);
  const v = sub(from.target, from.pos);
  const f = nrm([v[0], 0, v[2]]);
  const ax = nrm(cross(f, [0, 1, 0]));
  let ay = [0, 1, 0];
  if (tilt) ay = nrm([f[0] * Math.sin(tilt), Math.cos(tilt), f[2] * Math.sin(tilt)]);
  const hw = dist * Math.tan(((from.fov ?? 40) * Math.PI) / 360) * (16 / 9) * frac;
  return { c, ax, ay, hs: [hw, hw / aspect] };
}
// The world point seen at screen position (sx, sy) (-1..1) from camera `from`, `dist` metres away.
export function inView(from, sx, sy, dist) {
  const f = nrm(sub(from.target, from.pos));
  const r = nrm(cross(f, [0, 1, 0])), u = cross(r, f);
  const th = Math.tan(((from.fov ?? 40) * Math.PI) / 360);
  return from.pos.map((p, i) => p + dist * (f[i] + sx * th * (16 / 9) * r[i] + sy * th * u[i]));
}
// A plane lying on the ground at c, reading away from the camera `from`, `frac` of the screen wide.
export function lying(c, from, frac, aspect = 3, rise = 0.25) {
  return standing(c, from, frac, aspect, { tilt: Math.PI / 2 - rise });
}

// A lyric layer that travels with the camera: a plane facing it at (sx, sy) of the frame, trailing the
// camera's turns by a moment (follow-through), so a line never leaves the frame on a moving shot.
const unit = (c) => { const f = nrm(sub(c.target, c.pos)), r = nrm(cross(f, [0, 1, 0])); return { f, r, u: cross(r, f) }; };
export function layer(P, scene, opts) {
  // the words sung in this scene, kept in their lines; a long line may be broken in two with opts.wrap
  let L = opts.words === false ? [] : LINES.map((l) => ({ ...l, words: l.words.filter((w) => w.start >= P.from - 0.06 && w.start < P.to - 0.03) })).filter((l) => l.words.length);
  if (opts.join) L = [{ ...L[0], words: L.flatMap((l) => l.words) }];
  const wrap = opts.wrap ?? 42; const LEAD = /^[“]?(and|with|to|from|by|who|that|through|throughout|he|I|as|for|of|between|an|in|his|born)$/i, END = /[,.;:—?!]”?$/, BAD = /^(and|the|a|an|of|to|with|will|shall|my|your|his|its|those|I|he|must|who)$/i;
  L = L.flatMap((l) => { const n = l.words.map((w) => w.w).join(' ').length; if (n <= wrap || l.words.length < 4) return [l]; let best = 1, bd = 1e9, c = 0; l.words.forEach((w, i) => { c += w.w.length + 1; if (i + 1 < l.words.length) { const d = Math.abs(c - n / 2) - (END.test(w.w) ? 9 : 0) - (LEAD.test(l.words[i + 1].w) ? 5 : 0) + (BAD.test(w.w) ? 12 : 0); if (d < bd) { bd = d; best = i + 1; } } }); return [{ ...l, words: l.words.slice(0, best) }, { ...l, words: l.words.slice(best) }]; });
  const aspect = opts.aspect ?? 3, H = Math.round(3840 / aspect), D = 10;
  const plane = (c, lag) => {
    const { f, r, u } = unit(c), l = unit(lag), th = Math.tan(((c.fov ?? 40) * Math.PI) / 360);
    const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0), clampd = (v) => Math.max(-0.02, Math.min(0.02, v));
    const ox = clampd(dot(l.f, r)) * 1.2, oy = clampd(dot(l.f, u)) * 1.2;
    const C = c.pos.map((p, i) => p + D * (f[i] + ((opts.sx ?? 0) * th * 16 / 9 + ox) * r[i] + ((opts.sy ?? 0.5) * th + oy) * u[i]));
    const hw = D * th * (16 / 9) * (opts.frac ?? 0.66);
    return { c: C, ax: r, ay: u, hs: [hw, hw / aspect] };
  };
  // at most two lines at once: when the next pair begins, the last one goes
  const pages = []; for (let i = 0; i < L.length; i += 2) pages.push(L.slice(i, i + 2)); if (pages.length > 1 && pages[pages.length - 1].length === 1 && L.length === 3) { pages.length = 0; const g1 = L[2].words[0].start - L[1].words[L[1].words.length - 1].end, g0 = L[1].words[0].start - L[0].words[L[0].words.length - 1].end; if (g0 > g1) pages.push([L[0]], [L[1], L[2]]); else pages.push([L[0], L[1]], [L[2]]); }
  return {
    textSize: [3840, H], shade: opts.shade ?? 0.3,
    textPlane: (t, cam) => plane(cam ?? scene.camera(t), scene.camera(Math.max(P.from, t - 0.12))),
    drawText(ctx, t) {
      pages.forEach((pg, i) => { const next = pages[i + 1]?.[0].words[0].start; if (next !== undefined && t > next + 0.05) return; if (t < pg[0].words[0].start - 0.1) return; setLines(ctx, pg, t, { x: opts.align === 'left' ? 160 : 1920, y: opts.y ?? H * 0.55, size: opts.size ?? Math.round(H * 0.2), align: opts.align ?? 'center', ink: opts.ink, maxW: 3560, fadeOut: next !== undefined ? [next - 0.22, next] : opts.fadeOut }); });
      opts.extra?.(ctx, t, H);
    },
  };
}
export { SIGNAL, BONE, ease, clamp01 };
