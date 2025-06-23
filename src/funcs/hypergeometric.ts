import { nCr } from "./combinatorics";

export const hypergeometricProbability = (
  N: number,
  K: number,
  n: number,
  k: number,
): number => {
  // Input validation
  if (N < 0 || K < 0 || n < 0 || k < 0) {
    throw new Error("All parameters must be non-negative");
  }
  if (K > N) {
    throw new Error("Success states (K) cannot exceed population size (N)");
  }
  if (n > N) {
    throw new Error("Sample size (n) cannot exceed population size (N)");
  }

  if (k > K || k > n || n - k > N - K) {
    return 0;
  }

  const numerator = nCr(K, k) * nCr(N - K, n - k);
  const denominator = nCr(N, n);

  if (denominator === 0) return 0;

  return numerator / denominator;
};

export const cumulativeProbability = (
  N: number,
  K: number,
  n: number,
  minK: number,
): number => {
  let cumulative = 0;
  const maxPossible = Math.min(K, n);

  for (let k = minK; k <= maxPossible; k++) {
    cumulative += hypergeometricProbability(N, K, n, k);
  }

  return cumulative;
};

export const exactlyKProbability = (
  deckSize: number,
  targetCards: number,
  drawCount: number,
  exactCount: number,
): number => {
  return hypergeometricProbability(
    deckSize,
    targetCards,
    drawCount,
    exactCount,
  );
};
