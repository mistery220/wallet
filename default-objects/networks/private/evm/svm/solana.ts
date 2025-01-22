import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { ChainData } from "@/types/network";

export const solanaConfig: ChainData = {
  displayName: "Solana",
  name: "solana",
  type: Networks.SVM,
  nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
  chainId: 7_565_164,
  category: NetworkCategory.DEFAULT,
  logo: "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/solana.svg",
  rpcUrls: [`https://mainnet.helius-rpc.com/?api-key=${process.env.EXPO_PUBLIC_HELIUS_API_KEY}`],
  blockExplorerUrl: "https://solscan.io",
};
