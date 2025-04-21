import { PERSIST_ROUTE_KEY } from "@/constants/store/keys";
import EncryptedStore from "@/encryption/EncryptedStore";
import { retrieveSecureData } from "@/encryption/storage/retrieve";
import { usePassStore } from "@/store/auth/password";
import { MaterialIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { RelativePathString, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PasswordValidationScreen = () => {
  const { setIsAuthenticated, isAuthenticated } = usePassStore();
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [supportsBiometrics, setSupportsBiometrics] = useState<boolean>(false);

  useEffect(() => {
    // Check if device supports biometric authentication
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setSupportsBiometrics(compatible && enrolled);

      // If supported, prompt for biometric auth immediately
      if (compatible && enrolled) {
        handleBiometricAuth();
      }
    };

    checkBiometricSupport();

    // Add AppState listener to detect when app comes back to foreground
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App has come to the foreground
        const checkAndTriggerBiometrics = async () => {
          const compatible = await LocalAuthentication.hasHardwareAsync();
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          setSupportsBiometrics(compatible && enrolled);

          if (compatible && enrolled) {
            await LocalAuthentication.cancelAuthenticate();
            handleBiometricAuth();
          }
        };

        checkAndTriggerBiometrics();
      }
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  async function authSuccess(storedPassword?: string) {
    if (!storedPassword) {
      storedPassword =
        (await retrieveSecureData("walletPassword")) || undefined;
    }
    if (storedPassword) {
      EncryptedStore.setPhrase(storedPassword as string);
      const lastRoute = await retrieveSecureData(PERSIST_ROUTE_KEY);
      router.push((lastRoute as RelativePathString) || "/");
      setIsAuthenticated(true);
    }
  }

  const validatePassword = async (): Promise<void> => {
    try {
      const storedPassword = await retrieveSecureData("walletPassword");

      if (password === storedPassword) {
        // Password is valid, authenticate
        authSuccess(storedPassword);
      } else {
        setErrorMessage("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (error) {
      console.error("Error validating password:", error);
      Alert.alert("Error", "There was a problem validating your password.");
    }
  };

  const handleBiometricAuth = async (): Promise<void> => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate to access ${process.env.EXPO_PUBLIC_APP_NAME}`,
        disableDeviceFallback: false,
        cancelLabel: "Cancel",
      });

      if (biometricAuth.success) {
        authSuccess();
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your password to access your wallet
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={validatePassword}>
              <Text style={styles.buttonText}>Unlock Wallet</Text>
            </TouchableOpacity>

            {supportsBiometrics && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricAuth}
              >
                <View style={styles.biometricIconContainer}>
                  <MaterialIcons name="fingerprint" size={28} color="white" />
                </View>
                <Text style={styles.biometricText}>Use Biometric Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF5252",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#333",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  biometricButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  biometricIconContainer: {
    marginRight: 10,
  },
  biometricText: {
    color: "white",
    fontSize: 16,
  },
});

export default PasswordValidationScreen;
