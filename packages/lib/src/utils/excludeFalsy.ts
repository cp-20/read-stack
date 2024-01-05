export const excludeFalsy = <T>(
  array: (T | null | undefined | 0 | '' | false)[],
): T[] => array.filter((item): item is T => Boolean(item));
