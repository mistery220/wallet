import { ChainTokenMap, Token, TokenMap } from "../token";

type TokensState = {
  isLoading: boolean;
  tokens: ChainTokenMap;
};

type TokensActions = {
  setIsLoading: (val: boolean) => void;
  setTokens: (chainId: number, tokens: TokenMap) => void;
  updateToken: (token: Token) => void;
};

export type TokensStore = TokensState & TokensActions;
