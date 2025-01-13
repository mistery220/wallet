import { ChainData, Chains } from "../network";

export type ChainsStore = {
  chains: Chains;
  setChains: (chains: Chains) => void;
  addNewChain: (chain: ChainData) => void;
};
