import { Networks } from "@/enums/network/ecosystem";

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  network: Networks;
  address: string;
  logo: string;
};
