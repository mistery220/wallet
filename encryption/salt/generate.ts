import { getRandomBytesAsync } from "expo-crypto";

/**
 * Generate a random salt
 * @returns The salt as a hex string
 */
export const generateSalt = async (): Promise<string> => {
  const randomBytes = await getRandomBytesAsync(16); // 128-bit salt
  const base64Salt = btoa(String.fromCharCode(...randomBytes));
  return base64Salt;
};
