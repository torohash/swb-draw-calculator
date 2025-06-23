import { describe, expect, it } from "vitest";
import {
  cumulativeProbability,
  exactlyKProbability,
  hypergeometricProbability,
} from "../hypergeometric";

describe("hypergeometricProbability", () => {
  it("should calculate basic probabilities correctly", () => {
    const prob = hypergeometricProbability(40, 4, 7, 1);
    // C(4,1) * C(36,6) / C(40,7) = 4 * 1947792 / 18643560 = 0.41790130...
    expect(prob).toBeCloseTo(0.4179013, 5);
  });

  it("should return 0 for impossible cases", () => {
    expect(hypergeometricProbability(40, 4, 7, 5)).toBe(0);
    expect(hypergeometricProbability(40, 4, 7, 8)).toBe(0);
  });

  it("should handle edge cases", () => {
    expect(hypergeometricProbability(10, 0, 5, 0)).toBe(1);
    expect(hypergeometricProbability(10, 10, 10, 10)).toBe(1);
  });

  it("should calculate known probabilities correctly", () => {
    // Probability of drawing 0 target cards in 4 cards from 40-card deck with 4 targets
    const prob = hypergeometricProbability(40, 4, 4, 0);
    // C(4,0) * C(36,4) / C(40,4) = 1 * 58905 / 91390 = 0.6445453...
    expect(prob).toBeCloseTo(0.6445453, 5);
  });

  it("should validate input parameters", () => {
    expect(() => hypergeometricProbability(-1, 4, 7, 1)).toThrow(
      "All parameters must be non-negative",
    );
    expect(() => hypergeometricProbability(40, -4, 7, 1)).toThrow(
      "All parameters must be non-negative",
    );
    expect(() => hypergeometricProbability(40, 4, -7, 1)).toThrow(
      "All parameters must be non-negative",
    );
    expect(() => hypergeometricProbability(40, 4, 7, -1)).toThrow(
      "All parameters must be non-negative",
    );
    expect(() => hypergeometricProbability(40, 50, 7, 1)).toThrow(
      "Success states (K) cannot exceed population size (N)",
    );
    expect(() => hypergeometricProbability(40, 4, 50, 1)).toThrow(
      "Sample size (n) cannot exceed population size (N)",
    );
  });

  it("should sum to 1 for all possible outcomes", () => {
    const N = 20,
      K = 5,
      n = 8;
    let sum = 0;
    for (let k = 0; k <= Math.min(K, n); k++) {
      sum += hypergeometricProbability(N, K, n, k);
    }
    expect(sum).toBeCloseTo(1, 10);
  });
});

describe("cumulativeProbability", () => {
  it("should calculate cumulative probabilities correctly", () => {
    // Probability of drawing at least 1 target card
    const cumProb = cumulativeProbability(40, 4, 7, 1);
    // This is 1 - P(0) = 1 - C(36,7)/C(40,7)
    expect(cumProb).toBeCloseTo(0.5522486, 5);
  });

  it("should return 1 for minK = 0", () => {
    expect(cumulativeProbability(40, 4, 7, 0)).toBeCloseTo(1, 10);
  });

  it("should be greater than individual probability", () => {
    const individual = hypergeometricProbability(40, 4, 7, 1);
    const cumulative = cumulativeProbability(40, 4, 7, 1);
    expect(cumulative).toBeGreaterThanOrEqual(individual);
  });

  it("should handle impossible cases", () => {
    expect(cumulativeProbability(40, 4, 7, 5)).toBe(0);
  });
});

describe("exactlyKProbability", () => {
  it("should match hypergeometricProbability", () => {
    const prob1 = exactlyKProbability(40, 4, 7, 2);
    const prob2 = hypergeometricProbability(40, 4, 7, 2);
    expect(prob1).toBe(prob2);
  });
});
