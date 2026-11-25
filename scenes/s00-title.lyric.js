// The words of s00-title, on a plane that travels with its camera.
import scene from '/song/scenes/s00-title.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: 0.5, sx: 0, frac: 0.8, shade: 0.25, aspect: 3, words: false, extra: (ctx, t, H) => { titleCard(ctx, H, ease.inOut3((t - P.from - 1.9) / 1.6), ease.inOut3((t - P.from - 0.7) / 1.8), 1 - ease.inOut3((t - P.to + 0.9) / 0.8)); } });
