import { Wallet } from "@/types/wallet";
import { zustandAsyncStorage } from "@/utils/store/save-data/async";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { WalletStore } from "../../types/store/wallets";

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      wallets: [],
      addNewWallet: (wallet: Wallet) =>
        set((state) => {
          const wallets = state.wallets;
          wallets.push(wallet);
          return { wallets };
        }),
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => zustandAsyncStorage),
    }
  )
);
