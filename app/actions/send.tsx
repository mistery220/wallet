import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SendScreen() {
  const [recipient, setRecipient] = useState("");
  const [fromChain, setFromChain] = useState("");
  const [fromToken, setFromToken] = useState("");
  const [toChain, setToChain] = useState("");
  const [toToken, setToToken] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateAddress = (address: string) => {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  };

  const handleSend = () => {
    if (!recipient.trim()) {
      setError("Please enter a recipient address");
      return;
    }

    if (!validateAddress(recipient)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    if (!fromChain || !fromToken || !toChain || !toToken) {
      setError("Please select both chains and tokens");
      return;
    }

    setError("");
    router.push("/transaction");
  };

  const SelectionButton = ({ title, value, onPress }) => (
    <Pressable
      style={[styles.selectionButton, !value && styles.emptySelection]}
      onPress={onPress}
    >
      <Text style={styles.selectionButtonText}>
        {value || `Select ${title}`}
      </Text>
      <AntDesign name="right" size={20} color="#999" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From</Text>
          <View style={styles.selectionContainer}>
            <SelectionButton
              title="Token"
              value={fromToken}
              onPress={() => router.push("/tokens?from=true")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>To</Text>

          <View style={styles.selectionContainer}>
            <SelectionButton
              title="Token"
              value={toToken}
              onPress={() => router.push("/tokens?from=false")}
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Recipient Address</Text>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.focusedInput,
              error && { borderColor: "#ff4444" },
            ]}
            placeholder="Enter Ethereum address"
            placeholderTextColor="#666"
            value={recipient}
            onChangeText={(text) => {
              setRecipient(text);
              setError("");
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.sendButton,
            (!recipient || !fromChain || !fromToken || !toChain || !toToken) &&
              styles.disabledButton,
          ]}
          onPress={handleSend}
          disabled={
            !recipient || !fromChain || !fromToken || !toChain || !toToken
          }
        >
          <Text style={styles.sendButtonText}>Send</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  selectionContainer: {
    gap: 12,
  },
  selectionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  emptySelection: {
    borderColor: "#444",
  },
  selectionButtonText: {
    color: "white",
    fontSize: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  focusedInput: {
    borderColor: "#007AFF",
    backgroundColor: "#3a3a3a",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#1a1a1a",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
