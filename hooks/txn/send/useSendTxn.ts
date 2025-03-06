import { Networks } from "@/enums/network/ecosystem";
import { useChainsStore } from "@/store/chains";
import { useFormStore } from "@/store/form";
import { QuoteResponse } from "@/types/quotes/response";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { isNativeCurrency } from "@/utils/tokens/address";
import useTxn from "../useTxn";

export default function useSendTxn() {
  const { from, to } = useFormStore();
  const { chains } = useChainsStore();
  const { sendTransaction } = useTxn();

  async function sendToken(quotesResponse: QuoteResponse) {
    if (!from.assets || !to.assets) return;
    const chainId = from.assets.chainId;
    const network = chains[chainId].type;
    switch (network) {
      case Networks.EVM: {
        const hash = await sendTransaction({
          chainId,
          data: quotesResponse.transactionRequest.data,
          toAddress: quotesResponse.action.toAddress,
          amount: isNativeCurrency(from.assets.address)
            ? trimAndParseUnits(from.amount, from.assets.decimals)
            : 0n,
        });
        return hash;
      }
      case Networks.SVM: {
        const hash = await sendTransaction({
          chainId,
          data: quotesResponse.transactionRequest.data,
          toAddress: quotesResponse.action.toAddress,
        });
        return hash;
      }
    }
  }
  return { sendToken };
}
