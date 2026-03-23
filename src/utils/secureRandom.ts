/**
 * A cryptographically secure random number generator intended to be used
 * as a drop-in replacement for Math.random() to satisfy static analysis
 * security rules (e.g., Codacy, Datadog).
 *
 * @returns A floating-point, pseudo-random number between 0 (inclusive) and 1 (exclusive).
 */
export function secureRandom(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  // Fallback for environments without crypto (should not happen in modern browsers)
  return Math.random();
}
