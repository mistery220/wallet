import { HexString } from "@/types/address/evm";

export const stringToHexString = (str: string): HexString => {
  return `0x${str}`;
};

export function hexToUtf8(hex: string): string {
  return Buffer.from(hex.replace(/^0x/, ""), "hex").toString("utf8");
}
