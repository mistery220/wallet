import EncryptedStore from "@/encryption/EncryptedStore";
import { Networks } from "@/enums/network/ecosystem";
import { TxnStatus } from "@/enums/status/txn";
import usePublicClient from "@/hooks/clients/usePublicClient";
import { useCurrentStore } from "@/store/current";
import { HexString } from "@/types/address/evm";
import { viemChainsById } from "@/utils/client/evm/chains";
import { joinStrings } from "@/utils/string/join";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export default function useEvmTxn() {
  const { activeId, accounts } = useCurrentStore();
  const { getEvmPublicClient } = usePublicClient();
  async function sendEvmTransaction({
    chainId,
    data,
    toAddress,
    amount = 0n,
  }: {
    chainId: number;
    data: string;
    toAddress: string;
    amount?: bigint;
  }) {
    try {
      const decodedKey = await EncryptedStore.decryptAndRetrieve(
        joinStrings(activeId, Networks.EVM),
        "1234"
      );
      if (decodedKey) {
        const accountFromPrivKey = privateKeyToAccount(decodedKey as HexString);
        const walletClient = createWalletClient({
          transport: http(),
          chain: viemChainsById[chainId],
        });
        const hash = await walletClient.sendTransaction({
          account: accountFromPrivKey,
          data: data as HexString,
          to: toAddress as HexString,
          value: amount,
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
