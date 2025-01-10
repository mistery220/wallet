import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SendScreen() {
  const [recipient, setRecipient] = useState("");
  const [hash, setHash] = useState("");
  const [chainId, setChainId] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (!recipient.trim()) {
      Alert.alert("Error", "Please enter a valid account address.");
      return;
    }

    router.push("/transaction");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Funds</Text>
      <Text style={styles.subtitle}>
        Enter the recipient's account address:
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter account address"
        value={recipient}
        onChangeText={setRecipient}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
