import { Networks } from "@/enums/network/ecosystem";
import { TxnStatus } from "@/enums/status/txn";
import useEvmTxn from "./evm/useEvmTxn";
import useSvmTxn from "./svm/useSvmTxn";

export default function useTxn() {
  const { sendEvmTransaction, waitForEvmTransactionReceipt } = useEvmTxn();
  const { sendSvmTransaction, waitForSvmTransactionReceipt } = useSvmTxn();

  async function sendBridgeTransaction({
    network,
    chainId,
    data,
  }: {
    network: Networks;
    chainId: number;
    data: string;
  }) {
    switch (network) {
      case Networks.EVM: {
        return await sendEvmTransaction({ chainId });
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

  async function waitForTransactionReceipt({
    network,
    txnHash,
    chainId,
  }: {
    network: Networks;
    chainId: number;
    txnHash: string;
  }) {
    switch (network) {
      case Networks.EVM: {
        return await waitForEvmTransactionReceipt(chainId, txnHash);
      }
      case Networks.SVM: {
        return await waitForSvmTransactionReceipt(txnHash);
      }
      default:
        return {
          status: TxnStatus.Reverted,
        };
    }
  }
  return { sendBridgeTransaction, waitForTransactionReceipt };
}
