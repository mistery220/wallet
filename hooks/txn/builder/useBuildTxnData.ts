import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { QuoteRequest } from "@/types/quotes/request";
import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken, FormToken } from "@/types/token/form";
import {
  formatAndTrimUnits,
  trimAndParseUnits,
} from "@/utils/general/formatter";
import { isToAndFromSame } from "@/utils/tokens/address";
import { buildSameTransferQuoteToken } from "@/utils/txn/build";
import axios from "axios";
import { useState } from "react";

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
  }): Promise<QuoteResponse | undefined> {
    const network = chains[from.assets.chainId].type;
    const sender = accounts[activeId].address[network];
    if (isToAndFromSame(from.assets, to.assets)) {
      return await buildSameTransferQuoteToken({
        from,
        network,
        recipient,
        to,
        address: sender,
      });
    }
    const quoteRequest: QuoteRequest = {
      from: {
        ...from,
        amount: trimAndParseUnits(from.amount, from.assets.decimals).toString(),
      },
      recipient,
      sender,
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
    if (
      !isQuoteLoading &&
      from.assets &&
      to.assets &&
      (Number(from.amount) > 0 || Number(to.amount))
    ) {
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
