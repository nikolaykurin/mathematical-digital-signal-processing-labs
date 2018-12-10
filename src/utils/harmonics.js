import { getIntInRange } from './utils';

export const HARMONIC_DEFAULT_AMPLITUDE = 20;
export const HARMONIC_DEFAULT_FREQUENCY = 10;
export const HARMONIC_DEFAULT_PHASE = 1;

export const getDefaultHarmonic = () => {
  return {
    amplitude: HARMONIC_DEFAULT_AMPLITUDE,
    frequency: HARMONIC_DEFAULT_FREQUENCY,
    phase: HARMONIC_DEFAULT_PHASE
  }
};

export const getRandomHarmonic = () => {
  return {
    amplitude: getIntInRange(5, 100),
    frequency: getIntInRange(1, 10),
    phase: getIntInRange(1, 30)
  }
};
