import { useChainsStore } from "@/store/chains";
import { useUserTokensStore } from "@/store/user/tokens";
import { ChainTokenMap, TokenMap } from "@/types/token";
import { getUnmarshalBalanceUrl } from "@/utils/unmarshal/api";
import { formatUnmarshalResponse } from "@/utils/unmarshal/modify";

type BalanceParams = {
  address: string;
  chainId: number;
};

type TokenBalance = {
  contract_address: string;
  balance: string;
  token_name: string;
  token_symbol: string;
  logo_url?: string;
  decimals: number;
  chain_id: number;
};

export default function useTokenBalance() {
  const { setTokens } = useUserTokensStore();
  const { chains } = useChainsStore();
  const { tokens } = useUserTokensStore();

  async function fetchAllBalance({ address, chainId }: BalanceParams) {
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
      const formattedRespone = formatUnmarshalResponse(
        chains[chainId].type,
        data.assets
      );
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

  async function fetchTokenBalance({ address }: { address: string }) {
    try {
      // Get all chain IDs from the chains object
      const chainIds = Object.keys(chains).map(Number);

      // Fetch balances for all chains in parallel
      const balancePromises = chainIds.map((chainId) =>
        fetchAllBalance({ address, chainId })
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
    }
  }

  return { fetchAllBalance, fetchTokenBalance };
}
