import { Account } from "@/types/wallet/account";
import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CurrentStore } from "../../types/store/current";

export const useCurrentStore = create<CurrentStore>()(
  persist(
    (set) => ({
      chainId: 42161,
      accounts: {},
      activeId: "",
      twitterUsername: "",
      setTwitterUsername: (username: string) =>
        set({ twitterUsername: username }),
      addAndSetNewAccount: (account: Account) =>
        set((state) => {
          const acc = state.accounts;
          acc[account.id] = account;
          return {
            accounts: acc,
            activeId: account.id,
          };
        }),
      setChainId: (chainId: number) => set({ chainId }),
      setActiveId: (activeId: string) => set({ activeId }),
      updateAccount: (account: Account) =>
        set((state) => ({
          accounts: { ...state.accounts, [account.id]: account },
        })),
    }),
    {
      name: "current-state-storage",
      storage: createJSONStorage(() => zustandAsyncStorage),
    }
  )
);
