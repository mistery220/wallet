import { DEFAULT_DECIMAL_TRIM } from "@/constants/general/trim";
import { formatUnits } from "viem";

export const formatAndTrimUnits = (
  val: bigint | string,
  decimals: number,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const formattedVal = parseFloat(formatUnits(BigInt(val), decimals));
  return formattedVal.toFixed(units);
};

export const trimUnits = (
  val: number | string,
  units: number = DEFAULT_DECIMAL_TRIM
) => {
  const parsedNum = parseFloat(val.toString());
  return parsedNum.toFixed(units);
};

export const formatPrice = () => {};
