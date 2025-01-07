import CryptoES from "crypto-es";

/**
 * Decrypt data using AES
 * @param encryptedData - The Base64-encoded encrypted data
 * @param secretKey - The secret key used for decryption
 * @returns The decrypted plaintext
 */
export const decryptData = (
  encryptedData: string,
  secretKey: string
): string => {
  const bytes = CryptoES.AES.decrypt(encryptedData, secretKey);
  const originalData = bytes.toString(CryptoES.enc.Utf8);
  return originalData;
};
