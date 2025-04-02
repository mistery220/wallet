import {
  lowercasedNativeAddresses,
  evmNativeCurrency,
  svmNativeAddress,
  svmNativeAddressLowerCase,
} from "@/constants/address/native";
import { Networks } from "@/enums/network/ecosystem";
import { Token } from "@/types/token";
import { PublicKey } from "@solana/web3.js";
import { isAddress } from "viem";

export const getTokenAddress = (address: string) => {
  if (lowercasedNativeAddresses.includes(address.toLowerCase())) {
    return evmNativeCurrency;
  }
  return address;
};

export const validateAddressByNetwork = (
  address: string,
  network: Networks
) => {
  switch (network) {
    case Networks.EVM:
      return isAddress(address);
    case Networks.SVM: {
      const pubKey = new PublicKey(address);
      return PublicKey.isOnCurve(pubKey);
    }
  }
  return false;
};

export const isAddressValidForAnyNetwork = (address: string) => {
  const isValidEvmAddress = isAddress(address);
  if (isValidEvmAddress) return true;

  const pubKey = new PublicKey(address);
  const isValidSvmAddress = PublicKey.isOnCurve(pubKey);
  if (isValidSvmAddress) return true;
  return false;
};

export const isToAndFromSame = (from: Token, to: Token) => {
  return from.chainId === to.chainId && from.address === to.address;
};

export const isNativeCurrency = (address: string) => {
  return address === evmNativeCurrency;
};

export const isEvmNativeCurrency = (address: string) => {
  return address === evmNativeCurrency;
};

export const isSvmNativeCurrency = (address: string) => {
  return address.toLowerCase() === svmNativeAddressLowerCase;
};
