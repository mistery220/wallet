import EncryptedStorage from "react-native-encrypted-storage";

/**
 * Save the user's salt securely
 * @param salt - The salt to store
 */
export const saveSalt = async (salt: string): Promise<void> => {
  await EncryptedStorage.setItem("userSalt", salt);
};
