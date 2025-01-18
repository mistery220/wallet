import { InputSrc } from "@/enums/form/input";
import { FormToken } from "../token/form";

type FormState = {
  from: FormToken;
  to: FormToken;
  inputSrc: InputSrc;
};

type FormActions = {
  setToToken: (tokens: FormToken) => void;
  setFromToken: (token: FormToken) => void;
  setInputSrc: (src: InputSrc) => void;
};

export type FormStore = FormState & FormActions;
