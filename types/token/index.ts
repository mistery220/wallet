import { Networks } from "../network/type";

export type Token = {
  chainId: number;
  network: Networks;
  address: string;
};
