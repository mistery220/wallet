import { DEFAULT_DECIMAL_TRIM } from "@/constants/general/trim";
import { formatUnits, parseUnits } from "viem";

export const formatAndTrimUnits = (
  val: bigint | string,
  decimals: number,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const formattedVal = Number(formatUnits(BigInt(val), decimals));
  return parseFloat(formattedVal.toFixed(units)).toString();
};

export const trimUnits = (
  val: number | string,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const parsedNum = Number(val);
  return parseFloat(parsedNum.toFixed(units)).toString();
};

export const trimAndParseUnits = (amount: string, decimals: number) => {
  return parseUnits(trimUnits(amount, decimals), decimals);
};
