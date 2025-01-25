import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken } from "@/types/token/form";
import { getToolDetails, transformAction, transformEstimate } from ".";

export function buildErc20QuoteResponse(
  fromToken: CompleteFormToken,
  toToken: CompleteFormToken,
  encodedData: string
): QuoteResponse {
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
