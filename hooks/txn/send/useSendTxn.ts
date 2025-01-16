import { Networks } from "@/enums/network/ecosystem";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { buildEvmTxnData } from "@/utils/txn/evm/build";
import useTxn from "../useTxn";

export default function useSendTxn() {
  const { from, to } = useFormStore();
  const { active } = useCurrentStore();
  const { chains } = useChainsStore();
  const { sendTransaction } = useTxn();

  async function sendToken({
    recipient,
    sendAmount,
    receiveAmount,
  }: {
    recipient: string;
    sendAmount: string;
    receiveAmount: string;
  }) {
    if (!from || !to) return;
    const chainId = from.chainId;
    const network = chains[chainId].type;
    console.log({ network });
    switch (network) {
      case Networks.EVM: {
        const data = buildEvmTxnData({
          from,
          to,
          recipient,
          sendAmount,
          receiveAmount,
        });
        console.log({ encodedData: data });
        const hash = await sendTransaction({
          chainId,
          data,
          toAddress: to.address,
        });
        console.log({ hash });
        return hash;
      }
    }
  }
  return { sendToken };
}
