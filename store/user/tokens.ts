import { UserTokensStore } from "@/types/store/user/tokens";
import { ChainTokenMap, Token } from "@/types/token";
import { joinStrings } from "@/utils/string/join";
import { create } from "zustand";

export const useUserTokensStore = create<UserTokensStore>()((set) => ({
  isLoading: true,
  setIsLoading: (value: boolean) => set({ isLoading: value }),
  tokens: {},
  setTokens: (tokens: ChainTokenMap) => set({ tokens }),
  updateToken: (token: Token) =>
    set((state) => ({
      tokens: {
        ...state.tokens,
        [joinStrings(token.chainId, token.address)]: token,
      },
    })),
}));
