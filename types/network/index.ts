import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";

export type Chains = Record<number, ChainData>;

export type ChainData = {
  displayName: string;
  name: string;
  chainId: number;
  type: Networks;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  logo: string;
  category: NetworkCategory;
  rpcUrls: string[];
  blockExplorerUrl: string;
};
