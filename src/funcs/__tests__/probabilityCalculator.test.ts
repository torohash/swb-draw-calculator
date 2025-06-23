import { describe, expect, it } from "vitest";
import { MulliganType } from "../../types/drawTable";
import {
  calculateDrawProbability,
  calculateDrawProbabilityAtTurn,
  calculateInitialHandProbability,
  calculateMulliganProbability,
} from "../probabilityCalculator";

describe("calculateInitialHandProbability", () => {
  it("should calculate initial hand probabilities correctly", () => {
    // Probability of drawing at least 1 target card in 4 cards from 40-card deck with 4 targets
    const prob = calculateInitialHandProbability(40, 4, 4, 1);
    // 1 - C(36,4)/C(40,4) = 1 - 58905/91390 = 0.355454...
    expect(prob).toBeCloseTo(0.355454, 4);
  });

  it("should calculate for Shadowverse settings (40 cards, 3 copies)", () => {
    // Probability of drawing at least 1 target card in 4 cards from 40-card deck with 3 targets
    const prob = calculateInitialHandProbability(40, 3, 4, 1);
    // 1 - C(37,4)/C(40,4) = 1 - 66045/91390 = 0.27730...
    expect(prob).toBeCloseTo(0.2773, 4);
  });

  it("should return 0 for impossible cases", () => {
    expect(calculateInitialHandProbability(40, 4, 4, 5)).toBe(0);
  });

  it("should return 1 when minTarget is 0", () => {
    expect(calculateInitialHandProbability(40, 4, 4, 0)).toBe(1);
  });

  it("should validate deck configuration", () => {
    expect(() => calculateInitialHandProbability(40, 50, 4, 1)).toThrow(
      "Target cards cannot exceed deck size",
    );
    expect(() => calculateInitialHandProbability(40, 4, 50, 1)).toThrow(
      "Hand size cannot exceed deck size",
    );
    expect(() => calculateInitialHandProbability(-40, 4, 4, 1)).toThrow(
      "All parameters must be non-negative",
    );
  });
});

describe("calculateMulliganProbability", () => {
  it("should handle 0 exchange (no mulligan)", () => {
    const noMulligan = calculateMulliganProbability(40, 4, 0, 1);
    const initial = calculateInitialHandProbability(40, 4, 4, 1);
    expect(noMulligan).toBe(initial);
  });

  it("should calculate mulligan probabilities correctly for 40/4 deck", () => {
    const prob0 = calculateMulliganProbability(40, 4, 0, 1);
    const prob4 = calculateMulliganProbability(40, 4, 4, 1);

    expect(prob0).toBeCloseTo(0.355454, 4);
    // For full mulligan, this is more complex calculation
    // The exact value depends on the mulligan strategy implementation
    expect(prob4).toBeGreaterThan(0.3);
    expect(prob4).toBeLessThan(0.7);
  });

  it("should calculate mulligan probabilities correctly for Shadowverse settings", () => {
    // 40 cards, 3 copies, looking for at least 1
    const prob0 = calculateMulliganProbability(40, 3, 0, 1);
    const prob4 = calculateMulliganProbability(40, 3, 4, 1);

    expect(prob0).toBeCloseTo(0.2773, 4);
    // With optimal mulligan strategy, full mulligan gives higher probability
    expect(prob4).toBeCloseTo(0.498, 4);
  });

  it("should calculate all mulligan patterns", () => {
    const prob0 = calculateMulliganProbability(40, 4, 0, 1);
    const prob1 = calculateMulliganProbability(40, 4, 1, 1);
    const prob2 = calculateMulliganProbability(40, 4, 2, 1);
    const prob3 = calculateMulliganProbability(40, 4, 3, 1);
    const prob4 = calculateMulliganProbability(40, 4, 4, 1);

    // All probabilities should be between 0 and 1
    [prob0, prob1, prob2, prob3, prob4].forEach((prob) => {
      expect(prob).toBeGreaterThan(0);
      expect(prob).toBeLessThanOrEqual(1);
    });
  });

  it("should handle WITH_REPLACEMENT mulligan type", () => {
    const prob0 = calculateMulliganProbability(
      40,
      3,
      0,
      1,
      MulliganType.WITH_REPLACEMENT,
    );
    const prob4WithReplacement = calculateMulliganProbability(
      40,
      3,
      4,
      1,
      MulliganType.WITH_REPLACEMENT,
    );
    const prob4WithoutReplacement = calculateMulliganProbability(
      40,
      3,
      4,
      1,
      MulliganType.WITHOUT_REPLACEMENT,
    );

    expect(prob0).toBeCloseTo(0.2773, 4);
    // WITH_REPLACEMENT should give different (lower) probability than WITHOUT_REPLACEMENT
    expect(prob4WithReplacement).toBeLessThan(prob4WithoutReplacement);
    expect(prob4WithReplacement).toBeCloseTo(0.4777, 4); // Approximate value for WITH_REPLACEMENT
  });

  it("should handle edge cases", () => {
    expect(calculateMulliganProbability(40, 4, 4, 0)).toBe(1);
    expect(calculateMulliganProbability(40, 4, 4, 5)).toBe(0);
  });
});

describe("calculateDrawProbabilityAtTurn", () => {
  it("should calculate turn 0 correctly", () => {
    const prob = calculateDrawProbabilityAtTurn(40, 4, 0, 0, 1);
    const initial = calculateMulliganProbability(40, 4, 0, 1);
    expect(prob).toBe(initial);
  });

  it("should increase probability with more turns", () => {
    const turn0 = calculateDrawProbabilityAtTurn(40, 4, 0, 0, 1);
    const turn1 = calculateDrawProbabilityAtTurn(40, 4, 1, 0, 1);
    const turn2 = calculateDrawProbabilityAtTurn(40, 4, 2, 0, 1);

    expect(turn1).toBeGreaterThanOrEqual(turn0);
    expect(turn2).toBeGreaterThanOrEqual(turn1);
  });
});

describe("calculateDrawProbability", () => {
  it("should return array of results", () => {
    const results = calculateDrawProbability(40, 4, 1, 5, 1);
    expect(results).toHaveLength(5);
  });

  it("should return percentages", () => {
    const results = calculateDrawProbability(40, 4, 1, 3, 1);
    for (const result of results) {
      expect(result.none).toBeGreaterThanOrEqual(0);
      expect(result.none).toBeLessThanOrEqual(100);
      expect(result.exchange1).toBeGreaterThanOrEqual(0);
      expect(result.exchange1).toBeLessThanOrEqual(100);
      expect(result.exchange2).toBeGreaterThanOrEqual(0);
      expect(result.exchange2).toBeLessThanOrEqual(100);
      expect(result.exchange3).toBeGreaterThanOrEqual(0);
      expect(result.exchange3).toBeLessThanOrEqual(100);
      expect(result.exchange4).toBeGreaterThanOrEqual(0);
      expect(result.exchange4).toBeLessThanOrEqual(100);
    }
  });

  it("should show monotonic probability increase", () => {
    const results = calculateDrawProbability(40, 4, 1, 10, 1);

    for (let i = 1; i < results.length; i++) {
      expect(results[i].none).toBeGreaterThanOrEqual(results[i - 1].none);
      expect(results[i].exchange1).toBeGreaterThanOrEqual(
        results[i - 1].exchange1,
      );
      expect(results[i].exchange2).toBeGreaterThanOrEqual(
        results[i - 1].exchange2,
      );
      expect(results[i].exchange3).toBeGreaterThanOrEqual(
        results[i - 1].exchange3,
      );
      expect(results[i].exchange4).toBeGreaterThanOrEqual(
        results[i - 1].exchange4,
      );
    }
  });

  it("should show different probabilities for different mulligan patterns", () => {
    const results = calculateDrawProbability(40, 3, 1, 5, 1);

    for (const result of results) {
      // More exchanges should give higher probability
      expect(result.exchange1).toBeGreaterThan(result.none);
      expect(result.exchange2).toBeGreaterThan(result.exchange1);
      expect(result.exchange3).toBeGreaterThan(result.exchange2);
      expect(result.exchange4).toBeGreaterThan(result.exchange3);
    }
  });

  it("should handle edge cases", () => {
    // When there are no target cards in deck, probability is 0
    const results = calculateDrawProbability(40, 1, 1, 5, 2);
    for (const result of results) {
      expect(result.none).toBe(0);
      expect(result.exchange1).toBe(0);
      expect(result.exchange2).toBe(0);
      expect(result.exchange3).toBe(0);
      expect(result.exchange4).toBe(0);
    }
  });

  it("should calculate correct values for turn 1", () => {
    const results = calculateDrawProbability(40, 4, 1, 1, 1);
    const firstResult = results[0];

    // Turn 1 includes initial hand + 1 draw, so probability is higher
    expect(firstResult.none / 100).toBeGreaterThan(0.35);
    expect(firstResult.none / 100).toBeLessThan(0.45);
  });
});
