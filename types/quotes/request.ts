import { InputSrc } from "@/enums/form/input";
import { FormToken } from "../token/form";

export type QuoteRequest = {
  from: FormToken;
  to: FormToken;
  sender: string;
  recipient: string;
  slippage: number;
  inputSrc: InputSrc;
};
