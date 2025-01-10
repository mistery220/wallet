import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

const ExistingWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState("");

  const handleImport = () => {
    if (seedPhrase.split(" ").length === 12) {
      router.push("/profile");
    } else {
      Alert.alert(
        "Invalid Seed Phrase",
        "Please enter a valid 12-word seed phrase."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your 12-word seed phrase"
        multiline
        value={seedPhrase}
        onChangeText={setSeedPhrase}
      />
      <Button color="white" title="Import" onPress={handleImport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    color: "white",
  },
});

export default ExistingWallet;
