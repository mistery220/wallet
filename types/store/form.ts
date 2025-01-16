import { Token } from "../token";

type FormState = {
  from?: Token;
  to?: Token;
};

type FormActions = {
  setToToken: (tokens: Token) => void;
  setFromToken: (token: Token) => void;
};

export type FormStore = FormState & FormActions;
