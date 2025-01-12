import { UserTokensStore } from "@/types/store/user/tokens";
import { UserToken, UserTokenMap } from "@/types/token/user";
import { joinStrings } from "@/utils/string/join";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserTokensStore = create<UserTokensStore>()(
  persist(
    (set) => ({
      isLoading: true,
      setIsLoading: (value: boolean) => set({ isLoading: value }),
      tokens: {},
      setTokens: (tokens: UserTokenMap) => set({ tokens }),
      updateToken: (token: UserToken) =>
        set((state) => ({
          tokens: {
            ...state.tokens,
            [joinStrings(token.chainId, token.address)]: token,
          },
        })),
    }),
    {
      name: "user-tokens-storage",
    }
  )
);
