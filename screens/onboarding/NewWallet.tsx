import { Link } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const NewSeedPhraseScreen = () => {
  const [seedPhrase] = useState("Expel");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your New Seed Phrase</Text>
      <Text style={styles.seedPhrase}>{seedPhrase}</Text>
      <Link style={styles.title} href="/profile">
        I Have Copied It
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  seedPhrase: { fontSize: 16, marginBottom: 20 },
});

export default NewSeedPhraseScreen;
