import Aes from "react-native-aes-crypto";
/**
 * Decrypt data using AES
 * @param encryptedData - The encrypted string (base64)
 * @param key - The encryption key (256-bit)
 * @param iv - The initialization vector (128-bit)
 * @returns The decrypted plaintext
 */
export const decryptData = async (
  encryptedData: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    const decrypted = await Aes.decrypt(encryptedData, key, iv, "aes-256-cbc");
    return decrypted;
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw error;
  }
};
