import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { ChainData } from "@/types/network";

export const arbitrumConfig: ChainData = {
  displayName: "Arbitrum",
  name: "arbitrum",
  type: Networks.EVM,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  chainId: 42_161,
  category: NetworkCategory.DEFAULT,
  logo: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
  rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  blockExplorerUrl: "https://arbiscan.io",
};
