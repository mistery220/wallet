import { Account } from "./account";

export type Wallet = {
  accounts: Account[];
  active: Account;
};
