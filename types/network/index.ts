import { Networks } from "./type";

export type Chain = {
  type: Networks;
  chainId: number;
  rpcs: string[];
};
