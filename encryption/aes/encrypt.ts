import CryptoES from "crypto-es";

/**
 * Encrypt data using AES
 * @param data - The plaintext to encrypt
 * @param secretKey - The secret key used for encryption
 * @returns The encrypted data (Base64)
 */
export const encryptData = (data: string, secretKey: string): string => {
  const encrypted = CryptoES.AES.encrypt(data, secretKey).toString();
  return encrypted;
};
