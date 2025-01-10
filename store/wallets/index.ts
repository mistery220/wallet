import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletStore } from "../types/wallets";

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      wallets: [],
    }),
    { name: "current-state-storage" }
  )
);
