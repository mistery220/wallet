import Aes from "react-native-aes-crypto";

/**
 * Encrypt data using AES
 * @param data - The plaintext to encrypt
 * @param key - The encryption key (256-bit)
 * @param iv - The initialization vector (128-bit)
 * @returns The encrypted string (base64)
 */
export const encryptData = async (
  data: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    const encrypted = await Aes.encrypt(data, key, iv, "aes-256-cbc");
    return encrypted;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
};
