import { Wallet } from "@/types/wallet";

type WalletStoreState = {
  wallets: Wallet[];
};

type WalletStoreActions = { addNewWallet: (wallet: Wallet) => void };

export type WalletStore = WalletStoreState & WalletStoreActions;
