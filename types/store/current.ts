import { Account } from "@/types/wallet/account";

type CurrentStoreState = {
  accounts: Record<string, Account>;
  chainId: number;
  activeId: string;
};

type CurrentStoreActions = {
  setChainId: (chainId: number) => void;
  setActiveId: (activeId: string) => void;
  addAndSetNewAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
};

export type CurrentStore = CurrentStoreState & CurrentStoreActions;
