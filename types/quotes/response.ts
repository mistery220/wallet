import { TokenRes } from "./token";

export type QuoteResponse = {
  toAddress: string;
  from: TokenRes;
  to: TokenRes;
  // netOutputValue: number;
  data: string;
  provider: string;
};
