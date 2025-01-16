import EncryptedStore from "@/encryption/EncryptedStore";
import { TxnStatus } from "@/enums/status/txn";
import usePublicClient from "@/hooks/clients/usePublicClient";
import { useCurrentStore } from "@/store/current";
import { HexString } from "@/types/address/evm";
import { viemChainsById } from "@/utils/client/evm/chains";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export default function useEvmTxn() {
  const { active } = useCurrentStore();
  const { getEvmPublicClient } = usePublicClient();
  async function sendEvmTransaction({
    chainId,
    data,
    toAddress,
  }: {
    chainId: number;
    data: string;
    toAddress: string;
  }) {
    try {
      const decodedKey = await EncryptedStore.decryptAndRetrieve(
        active.id,
        "1234"
      );
      if (decodedKey) {
        const accountFromPrivKey = privateKeyToAccount(decodedKey as HexString);
        const walletClient = createWalletClient({
          transport: http(),
          chain: viemChainsById[chainId],
        });
        // console.log({ walletClient, account: accountFromPrivKey });
        const hash = await walletClient.sendTransaction({
          account: accountFromPrivKey,
          data: data as HexString,
          to: toAddress as HexString,
        });
        return hash;
      }
    } catch (e) {
      console.log({ e });
    }
  }

  async function waitForEvmTransaction(chainId: number, txnHash: string) {
    const receipt = await getEvmPublicClient(chainId).waitForTransactionReceipt(
      {
        hash: txnHash as HexString,
      }
    );
    return { status: receipt.status as TxnStatus };
  }
  return { sendEvmTransaction, waitForEvmTransaction };
}
