import { Account } from "./account";

export type Wallet = {
  accounts: Account[];
  id: string;
  isPhrase: boolean;
};
