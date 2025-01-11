import { ChainData } from "@/types/network";
import { Networks } from "@/types/network/type";

export const arbitrumConfig: ChainData = {
  displayName: "Arbitrum",
  name: "arbitrum",
  type: Networks.EVM,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  chainId: 42_161,
  mainnet: true,
  logo: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
  rpcUrls: { default: { http: ["https://arb1.arbitrum.io/rpc"] } },
  multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
  blockExplorerUrl: "https://arbiscan.io",
  wNativeToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
};
