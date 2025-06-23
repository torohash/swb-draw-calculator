import { describe, expect, it } from "vitest";
import { nCr } from "../combinatorics";
import { calculateDrawProbability } from "../probabilityCalculator";

describe("Performance Tests", () => {
  it("should complete single calculation within reasonable time", () => {
    const start = performance.now();
    calculateDrawProbability(40, 4, 1, 10, 1);
    const end = performance.now();
    const duration = end - start;

    console.log(`Single calculation (10 turns): ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(50);
  });

  it("should handle 1000 calculations efficiently", () => {
    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      calculateDrawProbability(40, 4, 1, 1, 1);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / 1000;

    console.log(`1000 calculations: ${duration.toFixed(2)}ms total`);
    console.log(`Average per calculation: ${avgTime.toFixed(2)}ms`);

    expect(duration).toBeLessThan(1000);
    expect(avgTime).toBeLessThan(1);
  });

  it("should handle large deck calculations", () => {
    const start = performance.now();
    calculateDrawProbability(60, 8, 1, 10, 2);
    const end = performance.now();
    const duration = end - start;

    console.log(`Large deck calculation: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(100);
  });

  it("should handle extreme mulligan patterns", () => {
    const start = performance.now();
    const results = calculateDrawProbability(40, 4, 1, 5, 1);
    const end = performance.now();
    const duration = end - start;

    console.log(`All mulligan patterns (5 turns): ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(50);
    expect(results).toHaveLength(5);
  });
});

describe("Memory Usage Tests", () => {
  it("should not leak memory in repeated calculations", () => {
    const iterations = 10000;

    // Since we're running in browser environment, we can't measure memory directly
    // Instead, we'll verify the calculation completes without issues
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      calculateDrawProbability(40, 4, 1, 1, 1);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(
      `Completed ${iterations} calculations in ${duration.toFixed(2)}ms`,
    );

    // If there were memory leaks, this would likely timeout or crash
    expect(duration).toBeLessThan(5000);
  });
});

describe("Stress Tests", () => {
  it("should handle rapid parameter changes", () => {
    const start = performance.now();

    for (let deckSize = 30; deckSize <= 50; deckSize++) {
      for (let targetCards = 1; targetCards <= 4; targetCards++) {
        calculateDrawProbability(deckSize, targetCards, 1, 3, 1);
      }
    }

    const end = performance.now();
    const duration = end - start;

    console.log(
      `Stress test (84 different parameters): ${duration.toFixed(2)}ms`,
    );
    expect(duration).toBeLessThan(500);
  });

  it("should maintain accuracy under load", () => {
    const results1 = calculateDrawProbability(40, 4, 1, 5, 1);

    for (let i = 0; i < 1000; i++) {
      calculateDrawProbability(
        Math.floor(Math.random() * 20) + 30,
        Math.floor(Math.random() * 4) + 1,
        1,
        3,
        1,
      );
    }

    const results2 = calculateDrawProbability(40, 4, 1, 5, 1);

    expect(results1).toEqual(results2);
  });
});

describe("Combinatorics Performance", () => {
  it("should calculate large combinations efficiently", () => {
    const start = performance.now();
    const testCases = [
      [52, 5],
      [60, 10],
      [40, 20],
      [100, 5],
    ];

    for (const [n, r] of testCases) {
      nCr(n, r);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`Large combination calculations: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(10);
  });
});
