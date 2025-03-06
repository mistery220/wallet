import { SVM_TXN_RETRY_DELAY } from "@/constants/network/svm/connection";
import EncryptedStore from "@/encryption/EncryptedStore";
import { Networks } from "@/enums/network/ecosystem";
import { SVMTxnStatus } from "@/enums/network/svm/status";
import { TxnStatus } from "@/enums/status/txn";
import { useCurrentStore } from "@/store/current";
import { joinStrings } from "@/utils/string/join";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

export default function useSvmTxn() {
  const { activeId, accounts } = useCurrentStore();
  const connection = new Connection(
    process.env.EXPO_PUBLIC_HELIUS_SOLANA_RPC || ""
  );

  async function sendSvmTransaction({ data }: { data: string }) {
    try {
      const decodedKey = await EncryptedStore.decryptAndRetrieve(
        joinStrings(activeId, Networks.SVM),
        "1234"
      );
      if (!decodedKey) return;
      const keyPair = Keypair.fromSecretKey(bs58.decode(decodedKey));

      const swapTransactionBuf = Buffer.from(data, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      transaction.sign([keyPair]);
      const rawTransaction = transaction.serialize();
      const txnHash = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });
      return txnHash;
    } catch (e) {
      console.log({ e });
    }
  }

  async function waitForSvmTransactionReceipt(txnHash: string) {
    try {
      const startTime = Date.now();
      const timeout = 10000; // 10 seconds
      let txnStatus;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        txnStatus = await connection.getSignatureStatus(txnHash);

        if (txnStatus) {
          if (
            txnStatus.value?.confirmationStatus === SVMTxnStatus.Confirmed ||
            txnStatus.value?.confirmationStatus === SVMTxnStatus.Finalized
          ) {
            return {
              status: TxnStatus.Success,
            };
          } else {
            return {
              status: TxnStatus.Success,
            };
          }
        }

        if (Date.now() - startTime > timeout) {
          return {
            status: TxnStatus.Reverted,
          };
        }

        await new Promise((resolve) =>
          setTimeout(resolve, SVM_TXN_RETRY_DELAY)
        );
      }
    } catch (e) {
      console.log({ e });
      return {
        status: TxnStatus.Reverted,
      };
    }
  }
  return { sendSvmTransaction, waitForSvmTransactionReceipt };
}
