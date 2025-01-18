import { Networks } from "@/enums/network/ecosystem";
import { isAddress } from "viem";

export const isValidRecipient = (address: string, network: Networks) => {
  switch (network) {
    case Networks.EVM:
      return isAddress(address);
    default:
      return false;
  }
};
