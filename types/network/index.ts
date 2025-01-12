import { Networks } from "@/enums/network/ecosystem";

export type Chains = Record<number, ChainData>;

export type ChainData = {
  displayName: string;
  name: string;
  chainId: number;
  type: Networks;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  logo: string;
  mainnet: boolean;
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  multicallAddress?: string;
  blockExplorerUrl: string;
  wNativeToken?: string;
};
