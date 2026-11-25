// The film's finish. The signal colour is the light of God's presence: the only thing that glows
// white-gold, and the colour of his words.
export const SIGNAL = '255, 218, 150';
export const BONE = '246, 240, 226';
export function grade(t, extra = {}) {
  return { exposure: 1, saturation: 1.12, contrast: 1.02, lift: [0.010, 0.011, 0.015], gain: [1.0, 1.0, 0.99], grain: 0.018, vignette: 0.20, ca: 0.2, bloom: 0.10, threshold: 1.15, ...extra };
}
