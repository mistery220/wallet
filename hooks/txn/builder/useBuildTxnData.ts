import { erc20Abi } from "@/default-objects/artifacts/erc20Abi";
import { InputSrc } from "@/enums/form/input";
import { Erc20Methods } from "@/enums/txn/evm";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { HexString } from "@/types/address/evm";
import { QuoteRequest } from "@/types/quotes/request";
import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken, FormToken } from "@/types/token/form";
import { isValidRecipient } from "@/utils/form/recipient";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { joinStrings } from "@/utils/string/join";
import { isNativeCurrency, isToAndFromSame } from "@/utils/tokens/address";
import { buildSameTransferQuoteToken } from "@/utils/txn/build";
import axios from "axios";
import { useState } from "react";
import { encodeFunctionData } from "viem";

export default function useBuildTxnData() {
  const [quoteResponse, setQuoteResponse] = useState<
    QuoteResponse | undefined
  >();
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
  const { active } = useCurrentStore();
  const { chains } = useChainsStore();
  const { setToToken, setFromToken, inputSrc } = useFormStore();

  async function buildValidatedTxnData({
    from,
    recipient,
    to,
  }: {
    from: CompleteFormToken;
    to: CompleteFormToken;
    recipient: string;
  }) {
    const network = chains[from.assets.chainId].type;
    console.log({ inputSrc });
    if (isToAndFromSame(from.assets, to.assets)) {
      const sendVal = trimAndParseUnits(from.amount, from.assets.decimals);
      if (isNativeCurrency(from.assets.address)) {
        return {
          from: buildSameTransferQuoteToken({
            fromToken: from,
            inputSrc,
            toToken: to,
            updateType: InputSrc.From,
          }),
          data: "",
          provider: "",
          to: buildSameTransferQuoteToken({
            fromToken: from,
            inputSrc,
            toToken: to,
            updateType: InputSrc.To,
          }),
          toAddress: recipient,
        };
      } else {
        let encodedData = isValidRecipient(recipient, network)
          ? encodeFunctionData({
              abi: erc20Abi,
              functionName: Erc20Methods.Transfer,
              args: [recipient as HexString, sendVal],
            })
          : "";
        return {
          from: buildSameTransferQuoteToken({
            fromToken: from,
            inputSrc,
            toToken: to,
            updateType: InputSrc.From,
          }),
          data: encodedData,
          provider: "",
          to: buildSameTransferQuoteToken({
            fromToken: from,
            inputSrc,
            toToken: to,
            updateType: InputSrc.To,
          }),
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
      sender: active.address[network],
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
        const quoteRes = await buildValidatedTxnData({
          from: from as CompleteFormToken,
          recipient,
          to: to as CompleteFormToken,
        });
        if (inputSrc === InputSrc.From) {
          setToToken({
            ...to,
            amount:
              quoteRes?.to[joinStrings(to.assets.chainId, to.assets.address)]
                .amount || "",
          });
        } else {
          setFromToken({
            ...from,
            amount:
              quoteRes?.from[
                joinStrings(from.assets.chainId, from.assets.address)
              ].amount || "",
          });
        }
        setQuoteResponse(quoteRes);
      } catch (e) {
        console.log({ e });
      }
      setIsQuoteLoading(false);
    }
  }
  return { buildTxnData, quoteResponse, isQuoteLoading };
}
