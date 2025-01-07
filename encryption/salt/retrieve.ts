import EncryptedStorage from "react-native-encrypted-storage";

/**
 * Retrieve the user's salt
 * @returns The stored salt, or null if not found
 */
export const getSalt = async (): Promise<string | null> => {
  return await EncryptedStorage.getItem("userSalt");
};
