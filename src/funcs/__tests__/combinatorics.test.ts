import { describe, expect, it } from "vitest";
import { factorial, nCr } from "../combinatorics";

describe("nCr (Combination)", () => {
  it("should calculate basic combinations correctly", () => {
    expect(nCr(5, 2)).toBe(10);
    expect(nCr(10, 3)).toBe(120);
    expect(nCr(6, 4)).toBe(15);
  });

  it("should handle edge cases", () => {
    expect(nCr(5, 0)).toBe(1);
    expect(nCr(5, 5)).toBe(1);
    expect(nCr(0, 0)).toBe(1);
  });

  it("should return 0 for r > n", () => {
    expect(nCr(5, 6)).toBe(0);
  });

  it("should throw error for invalid inputs", () => {
    expect(() => nCr(-1, 2)).toThrow("n and r must be non-negative integers");
    expect(() => nCr(5, -1)).toThrow("n and r must be non-negative integers");
    expect(() => nCr(5.5, 2)).toThrow("n and r must be integers");
    expect(() => nCr(5, 2.5)).toThrow("n and r must be integers");
  });

  it("should handle large numbers", () => {
    expect(nCr(40, 4)).toBe(91390);
    expect(nCr(52, 5)).toBe(2598960);
  });

  it("should use symmetry property nCr(n,r) = nCr(n,n-r)", () => {
    expect(nCr(10, 7)).toBe(nCr(10, 3));
    expect(nCr(20, 15)).toBe(nCr(20, 5));
  });
});

describe("factorial", () => {
  it("should calculate factorials correctly", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(10)).toBe(3628800);
  });

  it("should throw error for negative numbers", () => {
    expect(() => factorial(-1)).toThrow(
      "Factorial is not defined for negative numbers",
    );
    expect(() => factorial(-5)).toThrow(
      "Factorial is not defined for negative numbers",
    );
  });

  it("should throw error for non-integer numbers", () => {
    expect(() => factorial(5.5)).toThrow(
      "Factorial is only defined for integers",
    );
    expect(() => factorial(3.14)).toThrow(
      "Factorial is only defined for integers",
    );
  });
});
