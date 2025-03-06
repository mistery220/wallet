import { Networks } from "@/enums/network/ecosystem";
import { CompleteFormToken } from "@/types/token/form";
import { isNativeCurrency, isSvmNativeCurrency } from "@/utils/tokens/address";
import { buildErc20QuoteResponse } from "../quote/evm/erc20";
import { buildEvmNativeQuoteResponse } from "../quote/evm/native";
import { buildSvmNativeQuoteResponse } from "../quote/svm/native";

export const buildSameTransferQuoteToken = async ({
  from,
  to,
  recipient,
  network,
  address,
}: {
  from: CompleteFormToken;
  to: CompleteFormToken;
  recipient: string;
  network: Networks;
  address: string;
}) => {
  console.log("hereee");
  switch (network) {
    case Networks.EVM: {
      if (isNativeCurrency(from.assets.address)) {
        return buildEvmNativeQuoteResponse(from, to, recipient);
      } else {
        return buildErc20QuoteResponse({
          fromToken: from,
          toToken: to,
          recipient,
        });
      }
    }
    case Networks.SVM: {
      if (isSvmNativeCurrency(from.assets.address)) {
        return await buildSvmNativeQuoteResponse(from, to, recipient, address);
      }
      else{
        
      }
    }
  }
};
