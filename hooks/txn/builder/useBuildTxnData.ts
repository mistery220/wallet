import { erc20Abi } from "@/default-objects/artifacts/erc20Abi";
import { Erc20Methods } from "@/enums/txn/evm";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { HexString } from "@/types/address/evm";
import { QuoteRequest } from "@/types/quotes/request";
import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken, FormToken } from "@/types/token/form";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { joinStrings } from "@/utils/string/join";
import { isNativeCurrency, isToAndFromSame } from "@/utils/tokens/address";
import { modifyTokenFormat } from "@/utils/txn/evm/build";
import axios from "axios";
import { useState } from "react";
import { encodeFunctionData } from "viem";

export default function useBuildTxnData() {
  const [quoteResponse, setQuoteResponse] = useState<
    QuoteResponse | undefined
  >();
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
  const { active } = useCurrentStore();
  const { setToToken, setFromToken } = useFormStore();
  console.log({ quoteResponse, isQuoteLoading });
  async function buildValidatedTxnData({
    from,
    recipient,
    to,
  }: {
    from: CompleteFormToken;
    to: CompleteFormToken;
    recipient: string;
  }) {
    if (isToAndFromSame(from.assets, to.assets)) {
      const sendVal = trimAndParseUnits(from.amount, from.assets.decimals);
      if (isNativeCurrency(from.assets.address)) {
        return {
          from: modifyTokenFormat(from.assets.chainId, [from]),
          data: "",
          provider: "",
          to: modifyTokenFormat(to.assets.chainId, [to]),
          toAddress: recipient,
        };
      } else {
        const encodedData = encodeFunctionData({
          abi: erc20Abi,
          functionName: Erc20Methods.Transfer,
          args: [recipient as HexString, sendVal],
        });
        return {
          from: modifyTokenFormat(from.assets.chainId, [from]),
          data: encodedData,
          provider: "",
          to: modifyTokenFormat(to.assets.chainId, [to]),
          toAddress: to.assets.address,
        };
      }
    }
    const quoteRequest: QuoteRequest = {
      from: {
        ...from,
        amount: trimAndParseUnits(from.amount, from.assets.decimals).toString(),
      },
      recipient,
      sender: active.address,
      slippage: 1,
      to: {
        ...to,
        amount: trimAndParseUnits(to.amount, to.assets.decimals).toString(),
      },
    };
    console.log({ quoteRequest });

    const quoteRes = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER}/swap/quote`,
      quoteRequest
    );
    return quoteRes.data as QuoteResponse;
  }

  async function buildTxnData({
    from,
    recipient,
    to,
  }: {
    from: FormToken;
    to: FormToken;
    recipient: string;
  }) {
    // @TODO add proper validation here
    if (!isQuoteLoading && from.assets && to.assets) {
      setIsQuoteLoading(true);
      setQuoteResponse(undefined);
      try {
        const quotesRes = await buildValidatedTxnData({
          from: from as CompleteFormToken,
          recipient,
          to: to as CompleteFormToken,
        });
        setToToken({
          ...to,
          amount:
            quoteResponse?.to[joinStrings(to.assets.chainId, to.assets.address)]
              .amount || "",
        });
        setQuoteResponse(quotesRes);
      } catch (e) {
        console.log({ e });
      }
      setIsQuoteLoading(false);
    }
  }
  return { buildTxnData, quoteResponse, isQuoteLoading };
}
