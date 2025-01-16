import { TokensStore } from "@/types/store/token";
import { Token, TokenMap } from "@/types/token";
import { getDefaultTokensList } from "@/utils/store/tokens/tokenslist";
import { create } from "zustand";

export const useTokensStore = create<TokensStore>()((set) => ({
  isLoading: true,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  tokens: getDefaultTokensList(),
  updateTokenList: (chainId: number, tokenList: TokenMap) =>
    set((state) => {
      const tokens = state.tokens;
      tokens[chainId] = tokenList;
      return {
        tokens,
      };
    }),
  updateToken: (chainId: number, token: Token) =>
    set((state) => {
      const tokens = state.tokens;
      if (tokens[chainId]) {
        tokens[chainId][token.address] = token;
      } else {
        tokens[chainId] = { [token.address]: token };
      }
      return tokens;
    }),
}));
