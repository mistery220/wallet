import { ChainTokenMap, Token } from "@/types/token";

type UserTokensState = {
  isLoading: boolean;
  tokens: ChainTokenMap;
};

type UserTokensActions = {
  setIsLoading: (val: boolean) => void;
  setTokens: (tokens: ChainTokenMap) => void;
  updateToken: (token: Token) => void;
};

export type UserTokensStore = UserTokensState & UserTokensActions;
