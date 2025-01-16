// import { SVM_TXN_RETRY_DELAY } from "@/constants/network/svm/connection";
// import { SVMTxnStatus } from "@/enums/network/svm/status";
// import { TxnStatus } from "@/enums/status/txn";

// export default function useSvmTxn() {
//   async function sendSvmTransaction({ data }: { data: string }) {
//     try {
//       const allocateTransaction = new Transaction();
//       const txnInstructions = data.map(
//         (ins) =>
//           new TransactionInstruction({
//             data: ins.data,
//             keys: ins.keys.map((acc) => {
//               return { ...acc, pubkey: new PublicKey(acc.pubkey) };
//             }),
//             programId: ins.programId,
//           })
//       );
//       allocateTransaction.add(...txnInstructions);
//       const txnHash = await sendTransaction(allocateTransaction, connection, {
//         skipPreflight: true,
//       });
//       return {
//         status: TxnStatus.Success,
//         txnHash,
//       };
//     } catch (e) {
//       console.log({ e });
//       return {
//         status: TxnStatus.Reverted,
//       };
//     }
//   }

//   async function waitForSvmTransactionReceipt(txnHash: string) {
//     try {
//       const startTime = Date.now();
//       const timeout = 10000; // 10 seconds
//       let txnStatus;

//       // eslint-disable-next-line no-constant-condition
//       while (true) {
//         txnStatus = await connection.getSignatureStatus(txnHash);

//         if (txnStatus) {
//           if (
//             txnStatus.value?.confirmationStatus === SVMTxnStatus.Confirmed ||
//             txnStatus.value?.confirmationStatus === SVMTxnStatus.Finalized
//           ) {
//             return {
//               status: TxnStatus.Success,
//             };
//           } else {
//             return {
//               status: TxnStatus.Success,
//             };
//           }
//         }

//         if (Date.now() - startTime > timeout) {
//           return {
//             status: TxnStatus.Reverted,
//           };
//         }

//         await new Promise((resolve) =>
//           setTimeout(resolve, SVM_TXN_RETRY_DELAY)
//         );
//       }
//     } catch (e) {
//       console.log({ e });
//       return {
//         status: TxnStatus.Reverted,
//       };
//     }
//   }
//   return { sendSvmTransaction, waitForSvmTransactionReceipt };
// }
