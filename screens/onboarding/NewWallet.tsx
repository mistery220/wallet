import { useCurrentStore } from "@/store/current";
import { useWalletStore } from "@/store/wallets";
import { Account } from "@/types/wallet/account";
import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { mnemonicToAccount } from "viem/accounts";

const NewSeedPhraseScreen = () => {
  const mnemonic =
    "legal winner thank year wave sausage worth useful legal winner thank yellow";
  const { addNewWallet } = useWalletStore();
  const { setActiveAccount, setWallet } = useCurrentStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your New Seed Phrase</Text>
      <View style={styles.seedPhrase}>
        {mnemonic.split(" ").map((word, idx) => (
          <Text key={word+idx} style={styles.word}>{word}</Text>
        ))}
      </View>
      <Button
        title="I Have Copied It"
        onPress={() => {
          const account = mnemonicToAccount(mnemonic, {
            accountIndex: 0,
            addressIndex: 0,
          });
          const acc = {
            address: account.address,
            name: "Account 1",
            id: account.address,
          };
          const accounts: Account[] = [acc];
          const newWallet = { accounts, id: "Wallet 1" };
          addNewWallet(newWallet);
          setActiveAccount(acc);
          setWallet(newWallet);
          router.push("/profile");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "white" },
  seedPhrase: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures words wrap into multiple rows
    justifyContent: "space-between", // Space between columns
    alignItems: "center", // Align items vertically in the row
    margin: 10,
  },
  word: {
    fontSize: 16,
    marginBottom: 20, // Space between rows
    color: "white",
    width: "30%", // Ensures 3 items per row (adjust for margin)
    textAlign: "center", // Centers the word
    backgroundColor: "#333", // Optional: Background color for visibility
    padding: 10, // Padding for a better look
    borderRadius: 8, // Rounded corners for better design
  },
});

export default NewSeedPhraseScreen;
