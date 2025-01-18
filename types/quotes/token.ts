import { Networks } from "@/enums/network/ecosystem";

export type TokenReqData = {
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  network: Networks;
  address: string;
  bal: string;
};

export type TokenRes = Record<string, TokenResData>;

export type TokenResData = {
  chainId: number;
  address: string;
  amount: string;
};
