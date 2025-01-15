import { formatUnits } from "viem";

export const formatAndTrimUnits = (val: bigint | string, decimals: number) => {
  const formattedVal = parseFloat(formatUnits(BigInt(val), decimals));
  return formattedVal.toFixed(decimals);
};

export const trimUnits = (val: number | string, decimals: number) => {
  const parsedNum = parseFloat(val.toString());
  return parsedNum.toFixed(decimals);
};

export const formatPrice = () => {};
