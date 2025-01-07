import { getRandomBytesAsync } from "expo-crypto";

/**
 * Generate a random salt
 * @returns The salt as a hex string
 */
export const generateSalt = async (): Promise<string> => {
  const randomBytes = await getRandomBytesAsync(16); // 128-bit salt
  return Buffer.from(randomBytes).toString("hex");
};
