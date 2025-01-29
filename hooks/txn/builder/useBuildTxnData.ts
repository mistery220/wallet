import { erc20Abi } from "@/default-objects/artifacts/erc20Abi";
import { Erc20Methods } from "@/enums/txn/evm";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { HexString } from "@/types/address/evm";
import { QuoteRequest } from "@/types/quotes/request";
import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken, FormToken } from "@/types/token/form";
import { isValidRecipient } from "@/utils/form/recipient";
import {
  formatAndTrimUnits,
  trimAndParseUnits,
} from "@/utils/general/formatter";
import { buildErc20QuoteResponse } from "@/utils/quote/static/erc20";
import { buildNativeQuoteResponse } from "@/utils/quote/static/native";
import { isNativeCurrency, isToAndFromSame } from "@/utils/tokens/address";
import axios from "axios";
import { useState } from "react";
import { encodeFunctionData } from "viem";

export default function useBuildTxnData() {
  const [quoteResponse, setQuoteResponse] = useState<
    QuoteResponse | undefined
  >();
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
  const { activeId, accounts } = useCurrentStore();
  const { chains } = useChainsStore();
  const { setToToken, setFromToken, inputSrc, recipient } = useFormStore();

  async function buildValidatedTxnData({
    from,
    to,
  }: {
    from: CompleteFormToken;
    to: CompleteFormToken;
  }): Promise<QuoteResponse> {
    const network = chains[from.assets.chainId].type;
    if (isToAndFromSame(from.assets, to.assets)) {
      const sendVal = trimAndParseUnits(from.amount, from.assets.decimals);
      if (isNativeCurrency(from.assets.address)) {
        return buildNativeQuoteResponse(from, to, recipient);
      } else {
        let encodedData = isValidRecipient(recipient, network)
          ? encodeFunctionData({
              abi: erc20Abi,
              functionName: Erc20Methods.Transfer,
              args: [recipient as HexString, sendVal],
            })
          : "";
        return buildErc20QuoteResponse(from, to, encodedData);
      }
    }
    const quoteRequest: QuoteRequest = {
      from: {
        ...from,
        amount: trimAndParseUnits(from.amount, from.assets.decimals).toString(),
      },
      recipient,
      sender: accounts[activeId].address[network],
      slippage: 1,
      to: {
        ...to,
        amount: trimAndParseUnits(to.amount, to.assets.decimals).toString(),
      },
      inputSrc,
    };

    const quoteRes = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER}/swap/quote`,
      quoteRequest
    );
    return quoteRes.data as QuoteResponse;
  }

  async function buildTxnData({
    from,
    to,
  }: {
    from: FormToken;
    to: FormToken;
  }) {
    // @TODO add proper validation here
    if (!isQuoteLoading && from.assets && to.assets) {
      setIsQuoteLoading(true);
      setQuoteResponse(undefined);
      try {
        const quoteRes = await buildValidatedTxnData({
          from: from as CompleteFormToken,
          to: to as CompleteFormToken,
        });
        if (quoteRes) {
          setToToken({
            ...to,
            amount: formatAndTrimUnits(
              quoteRes.estimate.toAmount,
              to.assets.decimals,
              to.assets.decimals
            ),
          });

          setFromToken({
            ...from,
            amount: formatAndTrimUnits(
              quoteRes.estimate.fromAmount,
              from.assets.decimals,
              from.assets.decimals
            ),
          });
        }

        setQuoteResponse(quoteRes);
      } catch (e) {
        console.log("Quote fetching failed: ", { e });
      }
      setIsQuoteLoading(false);
    }
  }
  return { buildTxnData, quoteResponse, isQuoteLoading };
}
