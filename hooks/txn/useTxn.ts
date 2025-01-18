import { Networks } from "@/enums/network/ecosystem";
import { TxnStatus } from "@/enums/status/txn";
import { useChainsStore } from "@/store/chains";
import useEvmTxn from "./evm/useEvmTxn";

export default function useTxn() {
  const { chains } = useChainsStore();
  const { sendEvmTransaction, waitForEvmTransaction } = useEvmTxn();

  async function sendTransaction({
    chainId,
    data,
    toAddress,
    amount
  }: {
    chainId: number;
    data: string;
    toAddress: string;
    amount?: bigint;
  }) {
    const network = chains[chainId].type;
    switch (network) {
      case Networks.EVM: {
        return await sendEvmTransaction({ chainId, data, toAddress, amount });
      }
      //   case Networks.SVM: {
      //     return await sendSvmTransaction({data});
      //   }
      default:
        return {
          status: TxnStatus.Reverted,
        };
    }
  }

  async function waitForTransaction({
    network,
    hash,
    chainId,
  }: {
    network: Networks;
    chainId: number;
    hash: string;
  }) {
    switch (network) {
      case Networks.EVM: {
        return await waitForEvmTransaction(chainId, hash);
      }
      // case Networks.SVM: {
      //   return await waitForSvmTransactionReceipt(txnHash);
      // }
      default:
        return {
          status: TxnStatus.Reverted,
        };
    }
  }
  return { sendTransaction, waitForTransaction };
}
