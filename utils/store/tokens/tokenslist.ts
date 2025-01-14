import arbitrumTokensList from "@/default-objects/tokens/42161_tokens.json";
import { ChainIds } from "@/enums/network/chains";
import { ChainTokenMap, TokenMap } from "@/types/token";

export const getDefaultTokensList = (): ChainTokenMap => {
  return {
    [ChainIds.ARBITRUM_ONE]: arbitrumTokensList as unknown as TokenMap,
  };
};
