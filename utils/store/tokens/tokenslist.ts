import arbitrumTokensList from "@/default-objects/tokens/42161_tokens.json";
import solanaTokensList from "@/default-objects/tokens/7565164_tokens.json";
import { ChainIds } from "@/enums/network/chains";
import { ChainTokenMap, TokenMap } from "@/types/token";

export const getDefaultTokensList = (): ChainTokenMap => {
  return {
    [ChainIds.ArbitrumOne]: arbitrumTokensList as unknown as TokenMap,
    [ChainIds.Solana]: solanaTokensList as unknown as TokenMap,
  };
};
