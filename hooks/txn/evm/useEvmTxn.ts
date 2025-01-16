import usePublicClient from "@/hooks/clients/usePublicClient";
import { HexString } from "@/types/address/evm";

export default function useEvmTxn() {
  const { getEvmPublicClient } = usePublicClient();
  async function sendEvmTransaction({
    chainId,
  }: {
    chainId: number;
  }) {
    
  }

  async function waitForEvmTransactionReceipt(
    chainId: number,
    txnHash: string
  ) {
    return await getEvmPublicClient(chainId).waitForTransactionReceipt({
      hash: txnHash as HexString,
    });
  }
  return { sendEvmTransaction, waitForEvmTransactionReceipt };
}
