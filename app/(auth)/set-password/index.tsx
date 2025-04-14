// screens/auth/SetPasswordScreen.tsx
import { saveSecureData } from "@/encryption/storage/save";
import { usePassStore } from "@/store/auth/password";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigationContainerRef } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
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

const SetPasswordScreen = () => {
  const { setIsAuthenticated, setHasPassword } = usePassStore();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

  const checkPasswordStrength = (pass: string): void => {
    if (pass.length < 6) {
      setPasswordStrength("weak");
    } else if (pass.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const savePassword = async (): Promise<void> => {
    // Basic validation
    // if (password.length < 6) {
    //   setErrorMessage("Password must be at least 6 characters long");
    //   return;
    // }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Save password securely
      await saveSecureData("walletPassword", password);

      // Optional: Enable biometric authentication
      await saveSecureData("useBiometrics", "true");

      setIsAuthenticated(true);
      setHasPassword(true);
      // router.push("/(app)/(tabs)");
    } catch (error) {
      console.error("Error saving password:", error);
      Alert.alert("Error", "There was a problem saving your password.");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#FF5252";
      case "medium":
        return "#FFC107";
      case "strong":
        return "#4CAF50";
      default:
        return "#333";
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
            <MaterialIcons name="lock" size={48} color="white" />
            <Text style={styles.title}>Secure Your Wallet</Text>
            <Text style={styles.subtitle}>
              Create a password to protect your wallet
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Create Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a strong password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                checkPasswordStrength(text);
                setErrorMessage("");
              }}
            />

            {passwordStrength && (
              <View style={styles.strengthContainer}>
                <View
                  style={[
                    styles.strengthBar,
                    { backgroundColor: getStrengthColor() },
                  ]}
                />
                <Text
                  style={[styles.strengthText, { color: getStrengthColor() }]}
                >
                  {passwordStrength === "weak"
                    ? "Weak"
                    : passwordStrength === "medium"
                    ? "Medium"
                    : "Strong"}
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorMessage("");
              }}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                !password || !confirmPassword ? styles.buttonDisabled : null,
              ]}
              onPress={savePassword}
              disabled={!password || !confirmPassword}
            >
              <Text style={styles.buttonText}>Set Password</Text>
            </TouchableOpacity>

            <Text style={styles.securityNote}>
              Your password is stored securely on your device and is never sent
              to our servers.
            </Text>
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  inputLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    marginBottom: 16,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF5252",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#333",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  securityNote: {
    marginTop: 20,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
});

export default SetPasswordScreen;
