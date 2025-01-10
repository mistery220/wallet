import { HexString } from "@/types/address/evm";

export const stringToHexString = (str: string): HexString => {
  return `0x${str}`;
};
