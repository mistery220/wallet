import { Action, Estimate, QuoteResToken, ToolDetails } from "@/types/quotes/response";
import { CompleteFormToken } from "@/types/token/form";
import { trimAndParseUnits } from "@/utils/general/formatter";
import { calcDollarValue } from "@/utils/tokens/balance";

export function getToolDetails(): ToolDetails {
  return {
    key: "", // @TODO Define tool key
    name: "", // @TODO Define tool name
    logoURI: "", // @TODO Define tool logo
  };
}

function transformToken(token: CompleteFormToken): QuoteResToken {
  return {
    address: token.assets.address,
    chainId: token.assets.chainId,
    symbol: token.assets.symbol,
    decimals: token.assets.decimals,
    name: token.assets.name,
    coinKey: token.assets.symbol, // Assuming coinKey is the symbol
    logoURI: token.assets.logo,
    priceUSD: token.assets.usd, // Default to "0" if undefined
  };
}

export function transformAction(
  fromToken: CompleteFormToken,
  toToken: CompleteFormToken,
  fromAmount: string,
  recipient: string
): Action {
  return {
    fromToken: transformToken(fromToken),
    fromAmount: fromAmount,
    toToken: transformToken(toToken),
    fromChainId: fromToken.assets.chainId,
    toChainId: toToken.assets.chainId,
    slippage: 0, // @TODO Define slippage value if applicable
    fromAddress: "", // @TODO Define sender's address if required
    toAddress: recipient,
    destinationGasConsumption: "", // @TODO Define if applicable
    destinationCallData: "0x00", // Default placeholder
  };
}


export function transformEstimate(
    from: CompleteFormToken,
    to: CompleteFormToken
  ): Estimate {
    const fromAmount = trimAndParseUnits(
      from.amount,
      to.assets.decimals
    ).toString();
    const toAmount = trimAndParseUnits(to.amount, to.assets.decimals).toString();
    return {
      tool: "",
      approvalAddress: "",
      toAmountMin: toAmount,
      toAmount,
      fromAmount,
      feeCosts: [], // Empty for now, define if needed
      gasCosts: [], // @TODO add estimateGas and pass details here.
      executionDuration: 0, // Placeholder value
      fromAmountUSD: calcDollarValue({
        balance: from.assets.bal,
        decimals: from.assets.decimals,
        usdPrice: from.assets.usd,
      })?.toString(),
      toAmountUSD: calcDollarValue({
        balance: from.assets.bal,
        decimals: from.assets.decimals,
        usdPrice: from.assets.usd,
      })?.toString(),
    };
  }