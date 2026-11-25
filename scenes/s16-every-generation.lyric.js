// The words of s16-every-generation, on a plane that travels with its camera.
import scene from '/song/scenes/s16-every-generation.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.5, aspect: 3 });
