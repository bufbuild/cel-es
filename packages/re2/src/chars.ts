export const codePoint = (v: string): number => {
  const cp = v.codePointAt(0);
  if (cp === undefined) {
    throw new Error("codePoint: empty string");
  }
  return cp;
};

export const codePointAtOrThrow = (s: string, i: number): number => {
  const cp = s.codePointAt(i);
  if (cp === undefined) {
    throw new Error(
      `codePointAt(${i}) returned undefined for ${JSON.stringify(s)}`,
    );
  }
  return cp;
};
