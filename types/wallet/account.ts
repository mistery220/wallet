import { Networks } from "@/enums/network/ecosystem";

export type Account = {
  address: EcosystemAccount;
  name: string;
  id: string; //@TODO check if should be readonly
};

export type EcosystemAccount = Record<Networks, string>;
