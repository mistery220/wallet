import { Networks } from "@/enums/network/ecosystem";
import { isAddress } from "viem";
import {
  isAddressValidForAnyNetwork,
  validateAddressByNetwork,
} from "../tokens/address";

export const isValidRecipient = (address: string, network?: Networks) => {
  if (network) {
    validateAddressByNetwork(address, network);
  } else {
    isAddressValidForAnyNetwork(address);
  }
};
