export const HARMONIC_DEFAULT_AMPLITUDE = 10;
export const HARMONIC_DEFAULT_FREQUENCY = 5;
export const HARMONIC_DEFAULT_PHASE = 1;

export const getDefaultHarmonic = () => {
  return {
    amplitude: HARMONIC_DEFAULT_AMPLITUDE,
    frequency: HARMONIC_DEFAULT_FREQUENCY,
    phase: HARMONIC_DEFAULT_PHASE
  }
};
