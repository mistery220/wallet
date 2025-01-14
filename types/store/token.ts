import { ChainTokenMap, Token, TokenMap } from "../token";

type TokensState = {
  isLoading: boolean;
  tokens: ChainTokenMap;
};

type TokensActions = {
  setIsLoading: (val: boolean) => void;
  updateTokenList: (chainId: number, tokens: TokenMap) => void;
  updateToken: (chainid: number, token: Token) => void;
};

export type TokensStore = TokensState & TokensActions;
