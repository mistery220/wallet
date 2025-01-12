import { Networks } from "@/enums/network/ecosystem";

export type Token = {
  chainId: number;
  network: Networks;
  address: string;
  logo: string;
};
