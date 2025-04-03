import { Networks } from "@/enums/network/ecosystem";

export type Account = {
  address: EcosystemAccount;
  name: string;
  id: string;
  walletId: string;
  isPhrase: boolean;
  networks: Networks[];
  isSelectedToConnect: boolean;
};

export type EcosystemAccount = Record<Networks, string>;
