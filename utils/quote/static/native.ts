import { QuoteResponse } from "@/types/quotes/response";
import { CompleteFormToken } from "@/types/token/form";
import { getToolDetails, transformAction, transformEstimate } from ".";

export function buildNativeQuoteResponse(
  fromToken: CompleteFormToken,
  toToken: CompleteFormToken,
  recipient: string
): QuoteResponse {
  return {
    type: "", // @TODO Define if applicable
    id: "", // @TODO Assign an ID if required
    tool: "", // @TODO Define the tool
    toolDetails: getToolDetails(),
    action: transformAction(fromToken, toToken, fromToken.amount, recipient),
    estimate: transformEstimate(fromToken, toToken),
    includedSteps: [], // @TODO Define steps if applicable
    integrator: "", // @TODO Define the integrator
    transactionRequest: { data: "" },
  };
}
