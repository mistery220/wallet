import { useNetworkStore } from "@/store/networks/networks";
import { viemChainsById } from "@/utils/client/evm/chains";
import { createPublicClient, fallback, http, PublicClient } from "viem";

export default function useEvmClient() {
  const {} = useNetworkStore();

  // @TODO add in persist storage or make a const file
  const publicClients: Record<number, PublicClient> = {};

  function getEvmPublicClient(chainId: number) {
    if (publicClients[chainId]) {
      return publicClients[chainId];
    }
    const publicClient = createPublicClient({
      chain: viemChainsById[chainId],
      // @TODO update fallback as per user's provided first,
      // then ours and lastly default
      transport: fallback([http()]),
    });
    return publicClient;
  }
  return { getEvmPublicClient };
}
