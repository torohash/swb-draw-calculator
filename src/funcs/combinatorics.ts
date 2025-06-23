export const nCr = (n: number, r: number): number => {
  // Input validation
  if (n < 0 || r < 0) {
    throw new Error("n and r must be non-negative integers");
  }
  if (!Number.isInteger(n) || !Number.isInteger(r)) {
    throw new Error("n and r must be integers");
  }

  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n - r) r = n - r;

  let result = 1;
  for (let i = 0; i < r; i++) {
    result = Math.floor((result * (n - i)) / (i + 1));
  }

  return result;
};

export const factorial = (n: number): number => {
  if (n < 0) {
    throw new Error("Factorial is not defined for negative numbers");
  }
  if (!Number.isInteger(n)) {
    throw new Error("Factorial is only defined for integers");
  }
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};
