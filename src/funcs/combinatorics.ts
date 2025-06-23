export const nCr = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n - r) r = n - r;

  let result = 1;
  for (let i = 0; i < r; i++) {
    result = Math.floor((result * (n - i)) / (i + 1));
  }

  return result;
};

export const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};
