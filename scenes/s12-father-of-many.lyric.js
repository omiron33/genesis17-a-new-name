// The words of s12-father-of-many, on a plane that travels with its camera.
import scene from '/song/scenes/s12-father-of-many.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.5, aspect: 3 });
