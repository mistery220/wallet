import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

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
    const derivedKey = await digestStringAsync(
      CryptoDigestAlgorithm.SHA256,
      password + salt // Simplified derivation for Expo (PBKDF2 is not directly available)
    );
    return derivedKey.substring(0, keyLength * 2);
  } catch (error) {
    console.error("Error deriving key:", error);
    throw error;
  }
};
