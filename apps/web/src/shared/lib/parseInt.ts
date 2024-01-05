export const parseInt = <T>(
  str: string | undefined,
  fallback: T,
): number | T => {
  if (!str) {
    return fallback;
  }

  const result = Number.parseInt(str, 10);
  if (Number.isNaN(result)) {
    return fallback;
  }
  return 0;
};
