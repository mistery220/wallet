import { Wallet } from "@/types/wallet";
import { Account } from "@/types/wallet/account";

type CurrentStoreState = {
  wallet: Wallet;
  chainId: number;
  active: Account;
};

type CurrentStoreActions = {
  setWallet: (wallet: Wallet) => void;
  setChainId: (chainId: number) => void;
  setActiveAccount: (account: Account) => void;
};

export type CurrentStore = CurrentStoreState & CurrentStoreActions;
