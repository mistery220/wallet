import { InputSrc } from "@/enums/form/input";
import { CompleteFormToken } from "@/types/token/form";
import { joinStrings } from "@/utils/string/join";
import { getTokenAddress } from "@/utils/tokens/address";

export const buildSameTransferQuoteToken = ({
  fromToken,
  inputSrc,
  toToken,
  updateType,
}: {
  fromToken: CompleteFormToken;
  toToken: CompleteFormToken;
  inputSrc: InputSrc;
  updateType: InputSrc;
}) => {
  const selectedToken = updateType === InputSrc.From ? fromToken : toToken;
  const tokenAddress = getTokenAddress(selectedToken.assets.address);
  const tokenKey = joinStrings(selectedToken.assets.chainId, tokenAddress);
  return {
    [tokenKey]: {
      chainId: selectedToken.assets.chainId,
      address: tokenAddress,
      amount: inputSrc === InputSrc.From ? fromToken.amount : toToken.amount,
    },
  };
};
