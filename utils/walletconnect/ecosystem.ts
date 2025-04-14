import { Networks } from "@/enums/network/ecosystem";

export function getEcosystemFromWcChainId(wcChainType: string) {
  switch (wcChainType) {
    case "eip155": {
      return Networks.EVM;
    }
    case "solana": {
      return Networks.SVM;
    }
  }
  return Networks.EVM;
}
