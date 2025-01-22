import { useChainsStore } from "@/store/chains";
import { useUserTokensStore } from "@/store/user/tokens";
import { ChainTokenMap, TokenMap } from "@/types/token";
import { Account } from "@/types/wallet/account";
import { getUnmarshalBalanceUrl } from "@/utils/unmarshal/api";
import { formatUnmarshalResponse } from "@/utils/unmarshal/modify";

export default function useTokenBalance() {
  const { setTokens } = useUserTokensStore();
  const { chains } = useChainsStore();
  const { tokens } = useUserTokensStore();

  async function fetchAllBalance({
    address,
    chainId,
  }: {
    address: string;
    chainId: number;
  }) {
    try {
      const chainName = chains[chainId].name;
      const url = getUnmarshalBalanceUrl({
        address,
        chainName,
        includeLowVolume: false,
        offset: 0,
        verified: true,
      });

      const response = await fetch(url);
      const data = await response.json();
      
      const formattedRespone = data.assets
        ? formatUnmarshalResponse(chains[chainId], data.assets)
        : [];
      return {
        chainId,
        balances: formattedRespone,
      };
    } catch (error) {
      console.error(`Error fetching balance for chain ${chainId}:`, error);
      return {
        chainId,
        balances: [],
      };
    }
  }

  async function fetchTokenBalance({ account }: { account: Account }) {
    try {
      // Get all chain IDs from the chains object
      const chainIds = Object.keys(chains).map(Number);

      // Fetch balances for all chains in parallel
      const balancePromises = chainIds.map((chainId) =>
        fetchAllBalance({
          address: account.address[chains[chainId].type],
          chainId,
        })
      );

      const results = await Promise.all(balancePromises);

      // Combine all balances and organize by chain
      const tokensByChain = results.reduce((acc, { chainId, balances }) => {
        if (balances?.length > 0) {
          acc[chainId] = balances.reduce((accObj, token) => {
            accObj[token.address] = token;
            return accObj;
          }, {} as TokenMap);
        }
        return acc;
      }, {} as ChainTokenMap);

      // Update the token store
      setTokens({ ...tokens, ...tokensByChain });

      return tokensByChain;
    } catch (error) {
      console.error("Error fetching token balances:", error);
      return {};
    }
  }

  return { fetchAllBalance, fetchTokenBalance };
}
