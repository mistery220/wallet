import { FormToken } from "../token/form";

type FormState = {
  from: FormToken;
  to: FormToken;
};

type FormActions = {
  setToToken: (tokens: FormToken) => void;
  setFromToken: (token: FormToken) => void;
};

export type FormStore = FormState & FormActions;
