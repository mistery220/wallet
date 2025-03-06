import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken } from "@/types/token/form";
import { getToolDetails, transformAction, transformEstimate } from "..";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { trimAndParseUnits } from "@/utils/general/formatter";

export async function buildSvmNativeQuoteResponse(
  fromToken: CompleteFormToken,
  toToken: CompleteFormToken,
  recipient: string,
  sender: string
): Promise<QuoteResponse> {
  const connection = new Connection(
    process.env.EXPO_PUBLIC_HELIUS_SOLANA_RPC!,
    {
      commitment: "confirmed",
    }
  );
  const senderPublicKey = new PublicKey(sender);
  const recipientPublicKey = new PublicKey(recipient);
  const sendAmount = trimAndParseUnits(
    fromToken.amount,
    fromToken.assets.decimals
  );

  // Fetch latest blockhash
  const { blockhash } = await connection.getLatestBlockhash();

  const instruction = SystemProgram.transfer({
    fromPubkey: senderPublicKey,
    toPubkey: recipientPublicKey,
    lamports: sendAmount,
  });

  const messageV0 = new TransactionMessage({
    payerKey: senderPublicKey,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);
  const serializedTxn = Buffer.from(transaction.serialize()).toString("base64");;
  console.log({ serializedTxn });
  return {
    type: "", // @TODO Define if applicable
    id: "", // @TODO Assign an ID if required
    tool: "", // @TODO Define the tool
    toolDetails: getToolDetails(),
    action: transformAction(fromToken, toToken, fromToken.amount, recipient),
    estimate: transformEstimate(fromToken, toToken),
    includedSteps: [], // @TODO Define steps if applicable
    integrator: "", // @TODO Define the integrator
    transactionRequest: { data: serializedTxn },
  };
}
