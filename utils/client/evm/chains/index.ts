import { Chain as ViemChain } from "viem";
import * as viemChains from "viem/chains";
import { artheraChain } from "./additional/arthera";

const allViemChains = {
  ...viemChains,
  artheraChain,
};

export const viemChainsById: Record<number, ViemChain> = Object.values(
  allViemChains
).reduce((acc, chainData) => {
  return chainData.id
    ? {
        ...acc,
        [chainData.id]: chainData,
      }
    : acc;
}, {});
