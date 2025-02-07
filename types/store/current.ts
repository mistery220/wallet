import { Account } from "@/types/wallet/account";

type CurrentStoreState = {
  accounts: Record<string, Account>;
  chainId: number;
  activeId: string;
  twitterUsername: string;
  twitterId: string;
  userId: string;
};

type CurrentStoreActions = {
  setChainId: (chainId: number) => void;
  setActiveId: (activeId: string) => void;
  addAndSetNewAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  setTwitter: (id: string, username: string) => void;
  setUserId: (userId: string) => void;
};

export type CurrentStore = CurrentStoreState & CurrentStoreActions;
