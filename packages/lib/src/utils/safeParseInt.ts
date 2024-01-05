export const safeParseInt = (value: string) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseIntWithDefaultValue = <T>(
  value: string | undefined | null,
  defaultValue: T,
): number | T => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};
