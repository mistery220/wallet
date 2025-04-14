import EncryptedStore from "@/encryption/EncryptedStore";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const verifyPassword = async (password: string): Promise<boolean> => {
  // Implement actual password verification logic
  return password === "1234";
};

export default function ViewSeedPhrase() {
  const { walletId } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [seedPhrase, setSeedPhrase] = useState<string>();

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        const data = await EncryptedStore.decryptAndRetrieve(
          walletId as string
        );
        setSeedPhrase(data as string);
        setIsVerified(true);
      } else {
        Alert.alert("Error", "Incorrect password. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify password. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(seedPhrase as string);
    setCopiedText("Copied!");
    setTimeout(() => setCopiedText(""), 2000);
  };

  if (isVerified) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.warningBox}>
            <AntDesign name="warning" size={24} color="#FFD700" />
            <Text style={styles.warningText}>
              Never share your seed phrase with anyone. Store it securely
              offline.
            </Text>
          </View>

          <View style={styles.phraseContainer}>
            <View style={styles.phraseHeader}>
              <Text style={styles.title}>Seed Phrase</Text>
              <Pressable onPress={copyToClipboard} style={styles.copyButton}>
                <AntDesign name="copy1" size={20} color="#007AFF" />
                <Text style={styles.copyButtonText}>
                  {copiedText || "Copy"}
                </Text>
              </Pressable>
            </View>

            {seedPhrase && (
              <View style={styles.seedPhrase}>
                {seedPhrase.split(" ").map((word, idx) => (
                  <View key={idx} style={styles.wordContainer}>
                    <Text style={styles.wordNumber}>{idx + 1}</Text>
                    <Text style={styles.word}>{word}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <Pressable style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Password</Text>
        <Text style={styles.subtitle}>
          Enter your password to view the seed phrase
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={(val) => setPassword(val)}
          />
        </View>

        <Pressable
          style={[styles.verifyButton, !password && styles.disabledButton]}
          onPress={handleVerify}
          disabled={!password || isVerifying}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  warningText: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  phraseContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
  },
  phraseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyButtonText: {
    color: "#007AFF",
    fontSize: 14,
  },
  seedPhrase: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  wordContainer: {
    width: "30%",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  wordNumber: {
    color: "#666",
    fontSize: 12,
    marginRight: 8,
    width: 20,
  },
  word: {
    color: "white",
    fontSize: 14,
  },
  doneButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    margin: 20,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
