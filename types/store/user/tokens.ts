import { UserToken, UserTokenMap } from "@/types/token/user";

type UserTokensState = {
  isLoading: boolean;
  tokens: UserTokenMap;
};

type UserTokensActions = {
  setIsLoading: (val: boolean) => void;
  setTokens: (tokens: UserTokenMap) => void;
  updateToken: (token: UserToken) => void;
};

export type UserTokensStore = UserTokensState & UserTokensActions;
