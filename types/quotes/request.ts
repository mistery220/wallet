import { FormToken } from "../token/form";

export type QuoteRequest = {
    from: FormToken;
    to: FormToken;
    sender: string;
    recipient: string;
    slippage: number;
  };