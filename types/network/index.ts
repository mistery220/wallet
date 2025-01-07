import { NetworkType } from "./type";

export type Network = {
  type: NetworkType;
  chainId: number;
  rpcs: string[];
};
