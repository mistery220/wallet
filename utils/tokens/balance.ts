import { formatUnits } from "viem";

export const calcDollarValue = ({
  balance,
  decimals,
  usdPrice,
}: {
  balance: string;
  decimals: number;
  usdPrice?: string;
}) => {
  return usdPrice
    ? Number(formatUnits(BigInt(balance), decimals)) * parseFloat(usdPrice)
    : undefined;
};
