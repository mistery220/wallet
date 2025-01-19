import { ChainIds } from "@/enums/network/chains";
import { DefaultEvmChains } from "./private/evm";
import { solanaConfig } from "./private/evm/svm/solana";

export const DefaultChains = {
  ...DefaultEvmChains,
  [ChainIds.Solana]: solanaConfig,
};
