import EncryptedStorage from "react-native-encrypted-storage";
import { encryptData } from "../aes/encrypt";
import { deriveKey } from "../key/deriveKey";
import { generateSalt } from "../salt/generate";
import { getSalt } from "../salt/retrieve";
import { saveSalt } from "../salt/save";

/**
 * Save encrypted data securely
 * @param key - The storage key
 * @param value - The encrypted value
 */
export const saveSecureData = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await EncryptedStorage.setItem(key, value);
    console.log(`${key} saved successfully`);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

export const savePrivateKey = async (
  privateKey: string,
  password: string
): Promise<void> => {
  // Generate or retrieve the user's salt
  let salt = await getSalt();
  if (!salt) {
    salt = await generateSalt();
    await saveSalt(salt);
  }

  // Derive the encryption key from the password
  const key = await deriveKey(password, salt);

  // Generate a random IV
  const iv = await generateSalt(); // Reuse generateSalt for simplicity

  // Encrypt the private key
  const encryptedKey = await encryptData(privateKey, key, iv);

  // Save the encrypted private key and IV securely
  await saveSecureData("privateKey", encryptedKey);
  await saveSecureData("encryptionIV", iv);
};
