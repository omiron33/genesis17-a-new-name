// The words of s70-end, on a plane that travels with its camera.
import scene from '/song/scenes/s70-end.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: 0.0, sx: 0, frac: 0.8, shade: 0.25, aspect: 1.2, y: 2560, size: 200, extra: (ctx, t, H) => { titleCard(ctx, 1616, ease.inOut3((t - 340.6) / 1.8), ease.inOut3((t - 339.0) / 2.2), 1 - ease.inOut3((t - 348.9) / 0.9)); } });
