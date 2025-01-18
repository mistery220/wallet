export const getInputFontSize = (val: string) => {
  return val.length > 9 ? Math.max(18, 24 - (val.length - 9) * 1.5) : 24;
};
