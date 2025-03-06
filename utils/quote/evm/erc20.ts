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
