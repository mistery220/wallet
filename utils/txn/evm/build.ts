import { TokenRes } from "@/types/quotes/token";
import { CompleteFormToken } from "@/types/token/form";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { joinStrings } from "@/utils/string/join";
import { getTokenAddress } from "@/utils/tokens/address";

export const modifyTokenFormat = (
  chainId: number,
  tokens: CompleteFormToken[]
) => {
  return tokens.reduce((acc, token) => {
    const tokenAddress = getTokenAddress(token.assets.address);
    const tokenKey = joinStrings(chainId, tokenAddress);
    return {
      ...acc,
      [tokenKey]: {
        chainId,
        address: tokenAddress,
        amount: trimAndParseUnits(
          token.amount,
          token.assets.decimals
        ).toString(),
      },
    };
  }, {} as TokenRes);
};
