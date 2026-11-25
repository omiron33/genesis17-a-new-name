// The words of s52-a-spring, on a plane that travels with its camera.
import scene from '/song/scenes/s52-a-spring.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.5, aspect: 3 });
