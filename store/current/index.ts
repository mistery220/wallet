import { Wallet } from "@/types/wallet";
import { Account } from "@/types/wallet/account";
import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CurrentStore } from "../../types/store/current";

export const useCurrentStore = create<CurrentStore>()(
  persist(
    (set) => ({
      wallet: { accounts: [], id: "" },
      chainId: 1,
      active: { address: "", name: "", id: "" },
      setWallet: (wallet: Wallet) => set({ wallet }),
      setChainId: (chainId: number) => set({ chainId }),
      setActiveAccount: (account: Account) => set({ active: account }),
    }),
    {
      name: "current-state-storage",
      storage: createJSONStorage(() => zustandAsyncStorage),
    }
  )
);
