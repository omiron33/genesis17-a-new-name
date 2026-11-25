// The words of s38-sarrha, on a plane that travels with its camera.
import scene from '/song/scenes/s38-sarrha.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.5, aspect: 3 });
