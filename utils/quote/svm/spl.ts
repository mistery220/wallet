import { erc20Abi } from "@/default-objects/artifacts/erc20Abi";
import { Networks } from "@/enums/network/ecosystem";
import { Erc20Methods } from "@/enums/txn/evm";
import { HexString } from "@/types/address/evm";
import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken } from "@/types/token/form";
import { isValidRecipient } from "@/utils/form/recipient";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { encodeFunctionData } from "viem";
import { getToolDetails, transformAction, transformEstimate } from "..";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
} from "@solana/spl-token";

async function serializedTxnData(
  fromToken: CompleteFormToken,
  toToken: CompleteFormToken,
  recipient: string,
  sender: string
) {
  const connection = new Connection(
    process.env.EXPO_PUBLIC_HELIUS_SOLANA_RPC!,
    {
      commitment: "confirmed",
    }
  );
  const { blockhash } = await connection.getLatestBlockhash();

  const senderPublicKey = new PublicKey(sender);
  const recipientPublicKey = new PublicKey(recipient);
  const sendAmount = trimAndParseUnits(
    fromToken.amount,
    fromToken.assets.decimals
  );
  const tokenMintPublicKey = new PublicKey(fromToken.assets.address);

  // Get sender and receiver token accounts
  const senderTokenAccount = await getAssociatedTokenAddress(
    tokenMintPublicKey,
    senderPublicKey
  );
  const receiverTokenAccount = await getAssociatedTokenAddress(
    tokenMintPublicKey,
    recipientPublicKey
  );

  // Create SPL Token transfer instruction
  const instruction = createTransferCheckedInstruction(
    senderTokenAccount,
    tokenMintPublicKey,
    receiverTokenAccount,
    senderPublicKey,
    sendAmount,
    fromToken.assets.decimals
  );

  // Create transaction message
  const messageV0 = new TransactionMessage({
    payerKey: senderPublicKey,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();

  // Create VersionedTransaction
  const transaction = new VersionedTransaction(messageV0);
  const serializedTxn = Buffer.from(transaction.serialize()).toString("base64");
  console.log({ serializedTxn });
  return serializedTxn;
}

export function buildErc20QuoteResponse({
  fromToken,
  recipient,
  toToken,
}: {
  fromToken: CompleteFormToken;
  toToken: CompleteFormToken;
  recipient: string;
}): QuoteResponse {
  const sendAmount = trimAndParseUnits(
    fromToken.amount,
    fromToken.assets.decimals
  );
  let encodedData = isValidRecipient(recipient, Networks.EVM)
    ? encodeFunctionData({
        abi: erc20Abi,
        functionName: Erc20Methods.Transfer,
        args: [recipient as HexString, sendAmount],
      })
    : "";
  return {
    type: "", // @TODO Define if applicable
    id: "", // @TODO Assign an ID if required
    tool: "", // @TODO Define the tool
    toolDetails: getToolDetails(),
    action: transformAction(
      fromToken,
      toToken,
      fromToken.amount,
      toToken.assets.address
    ),
    estimate: transformEstimate(fromToken, toToken),
    includedSteps: [], // @TODO Define steps if applicable
    integrator: "", // @TODO Define the integrator
    transactionRequest: { data: encodedData },
  };
}
