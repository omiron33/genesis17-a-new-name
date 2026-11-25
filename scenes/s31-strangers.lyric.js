// The words of s31-strangers, on a plane that travels with its camera.
import scene from '/song/scenes/s31-strangers.js';
import { layer, gauge, titleCard, ease } from '/song/lib/type.js';

export default (P) => layer(P, scene(P), { sy: -0.7, sx: 0, frac: 0.74, shade: 0.35, aspect: 3, ink: '40, 26, 16' });
