import { DefaultChains } from "@/default-objects/networks";
import { ChainData, Chains } from "@/types/network";
import { ChainsStore } from "@/types/store/network";
import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useChainsStore = create<ChainsStore>()(
  persist(
    (set) => ({
      chains: { ...DefaultChains },
      setChains: (chains: Chains) => set({ chains }),
      addNewChain: (chain: ChainData) =>
        set((state) => {
          return { chains: { ...state.chains, [chain.chainId]: chain } };
        }),
      updateChain: (chain: ChainData) =>
        set((state) => {
          return { chains: { ...state.chains, [chain.chainId]: chain } };
        }),
    }),
    {
      name: "chains-state-storage",
      storage: createJSONStorage(() => zustandAsyncStorage),
    }
  )
);
