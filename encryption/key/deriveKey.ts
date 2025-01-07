import Aes from "react-native-aes-crypto";

/**
 * Derive a key using PBKDF2
 * @param password - The user's password or PIN
 * @param salt - A unique salt for this user (stored securely)
 * @param iterations - The number of iterations for PBKDF2
 * @param keyLength - The length of the derived key (32 bytes for AES-256)
 * @returns The derived key as a hex string
 */
export const deriveKey = async (
  password: string,
  salt: string,
  iterations = 10000,
  keyLength = 32
): Promise<string> => {
  try {
    const key = await Aes.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      "sha256"
    );
    return key;
  } catch (error) {
    console.error("Error deriving key:", error);
    throw error;
  }
};
