import {
  eFormatNativeCurrencyLowerCase,
  zeroAddress,
} from "@/constants/address/native";

export const getTokenAddress = (address: string) => {
  if (address.toLowerCase() === eFormatNativeCurrencyLowerCase) {
    return zeroAddress;
  }
  return address.toLowerCase();
};
