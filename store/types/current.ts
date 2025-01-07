import { Wallet } from "@/types/wallet";

type CurrentStoreState = {
  wallet: Wallet;
  chainId: number;
};

type CurrentStoreActions = {};

export type CurrentStore = CurrentStoreState & CurrentStoreActions;
