import { joinStrings } from "@/utils/string/join";
import { decryptData } from "./aes/decrypt";
import { encryptData } from "./aes/encrypt";
import { deriveKey } from "./key/deriveKey";
import { generateSalt } from "./salt/generate";
import { getSalt } from "./salt/retrieve";
import { saveSalt } from "./salt/save";
import { retrieveSecureData } from "./storage/retrieve";
import * as LocalAuthentication from "expo-local-authentication";
import { saveSecureData } from "./storage/save";
import { deleteSecureData } from "./storage/delete";
class EncryptedStorage {
  private static instance: EncryptedStorage;

  private constructor() {
    // private constructor
  }

  public static getInstance() {
    if (!EncryptedStorage.instance) {
      EncryptedStorage.instance = new EncryptedStorage();
    }
    return EncryptedStorage.instance;
  }

  async encryptAndStore(
    storeName: string,
    value: string,
    password: string
  ): Promise<void> {
    const saltKey = joinStrings(storeName, "salt");
    let salt = await getSalt(saltKey);
    if (!salt) {
      salt = await generateSalt();
      await saveSalt(saltKey, salt);
    }
    const key = await deriveKey(password, salt);
    const encryptedKey = encryptData(value, key);
    await saveSecureData(storeName, encryptedKey);
  }

  async decryptAndRetrieve(
    storeName: string,
    password: string
  ): Promise<string | null> {
    const saltKey = joinStrings(storeName, "salt");
    const salt = await getSalt(saltKey);
    if (!salt) {
      throw new Error("Salt not found. Cannot decrypt private key.");
    }
    const key = await deriveKey(password, salt);

    const encryptedKey = await retrieveSecureData(storeName);
    if (!encryptedKey) {
      throw new Error("Encrypted private key not found.");
    }
    const decryptedKey = decryptData(encryptedKey, key);
    return decryptedKey;
  }

  async isBiometricAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  async authenticateBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your account",
        fallbackLabel: "Enter password",
        cancelLabel: "Cancel",
      });
      return result.success;
    } catch (error) {
      console.error("Biometric authentication error", error);
      return false;
    }
  }

  async validateLogin(password: string): Promise<boolean> {
    try {
      const storeName = "Login";
      const encryptedKey = await retrieveSecureData(storeName);
      if (!encryptedKey) return false;
      await decryptData(encryptedKey, password);
      return true;
    } catch {
      return false;
    }
  }

  async enableBiometricLogin(password: string): Promise<void> {
    // Verify password first
    const isValid = await this.validateLogin(password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // Store a flag enabling biometric login
    await saveSecureData("BIOMETRIC_LOGIN_ENABLED", "true");
  }

  // Disable biometric login
  async disableBiometricLogin(): Promise<void> {
    await deleteSecureData("BIOMETRIC_LOGIN_ENABLED");
  }
}

export default EncryptedStorage.getInstance();
