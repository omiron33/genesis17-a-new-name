// The words of s69-foreigners, on a plane that travels with its camera.
import scene from '/song/scenes/s69-foreigners.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.5, aspect: 3 });
