import { Networks } from "@/enums/network/ecosystem";

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  network: Networks;
  address: string;
  logo: string;
  usd?: string;
  bal: string;
  usd_change_24h: string;
  verified: boolean;
};

export type TokenMap = Record<string, Token>;

export type ChainTokenMap = Record<number, TokenMap>;
