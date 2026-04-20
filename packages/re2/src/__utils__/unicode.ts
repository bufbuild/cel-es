const encoder = new TextEncoder();

export const utf16IndicesToUtf8 = (idx16: number[], text: string): number[] => {
  const idx8: number[] = new Array(idx16.length);
  for (let i = 0; i < idx16.length; ++i) {
    if (idx16[i] === -1) {
      idx8[i] = -1;
    } else {
      const subText = text.substring(0, idx16[i]);
      idx8[i] = encoder.encode(subText).length;
    }
  }
  return idx8;
};
