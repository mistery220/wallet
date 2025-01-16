import {
  eFormatNativeCurrencyLowerCase,
  nativeCurrency,
} from "@/constants/address/native";
import { Token } from "@/types/token";
import { isAddress } from "viem";

export const getTokenAddress = (address: string) => {
  if (address.toLowerCase() === eFormatNativeCurrencyLowerCase) {
    return nativeCurrency;
  }
  return address.toLowerCase();
};

export const validateAddress = (address: string) => {
  return isAddress(address);
};

export const isToAndFromSame = (from: Token, to: Token) => {
  return from.chainId === to.chainId && from.address === to.address;
};

export const isNativeCurrency = (address: string) => {
  return address === nativeCurrency;
};
