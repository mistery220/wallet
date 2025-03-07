import { DEFAULT_DECIMAL_TRIM } from "@/constants/general/trim";
import { formatUnits, parseUnits } from "viem";

export const formatAndTrimUnits = (
  val: bigint | string,
  decimals: number,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const formattedVal = Number(formatUnits(BigInt(val), decimals));
  const factor = Math.pow(10, decimals);
  return parseFloat(
    (Math.trunc(formattedVal * factor) / factor).toFixed(units)
  ).toString();
};

export const trimUnits = (
  val: number | string,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const parsedNum = Number(val);
  const factor = Math.pow(10, units);
  return parseFloat(
    (Math.trunc(parsedNum * factor) / factor).toFixed(units)
  ).toString();
};

export const trimAndParseUnits = (amount: string, decimals: number) => {
  return parseUnits(trimUnits(amount, decimals), decimals);
};
