import { Wallet } from "@/types/wallet";

type WalletStoreState = {
  wallets: Wallet[];
};

type WalletStoreActions = {};

export type WalletStore = WalletStoreState & WalletStoreActions;
