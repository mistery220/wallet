import { TokenMap } from "../token";

type FormState = {
  from: TokenMap;
  to: TokenMap;
};

type FormActions = {
  setToTokens: (tokens: TokenMap) => void;
  setFromTokens: (token: TokenMap) => void;
};

export type FormStore = FormState & FormActions;
