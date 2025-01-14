import EncryptedStore from "@/encryption/EncryptedStore";
import { useCurrentStore } from "@/store/current";
import { useWalletStore } from "@/store/wallets";
import { Account } from "@/types/wallet/account";
import { AntDesign } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useNavigationContainerRef } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { toHex } from "viem";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";

const NewSeedPhraseScreen = () => {
  const navigation = useNavigationContainerRef();
  const { addNewWallet } = useWalletStore();
  const { setActiveAccount, setWallet } = useCurrentStore();
  const [copiedText, setCopiedText] = useState("");
  const [mnemonic] = useState(() => generateMnemonic(english));

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(mnemonic);
    setCopiedText("Copied!");
    setTimeout(() => setCopiedText(""), 2000);
  }, [mnemonic]);

  const handleContinue = useCallback(() => {
    Alert.alert(
      "Important",
      "Have you safely stored your seed phrase? You won't be able to recover your wallet without it.",
      [
        {
          text: "No, let me copy",
          style: "cancel",
        },
        {
          text: "Yes, continue",
          onPress: async () => {
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
            const walletId = new Date().getTime().toString();
            const privKey = account.getHdKey().privateKey as Uint8Array<ArrayBufferLike>;
            const privKeyBytes = toHex(privKey);
            const newWallet = { accounts, id: walletId, isPhrase: true };
            // @TODO add password from user
            await EncryptedStore.encryptAndStore(
              newWallet.id,
              mnemonic,
              "1234"
            );
            await EncryptedStore.encryptAndStore(
              acc.id,
              privKeyBytes,
              "1234"
            );
            addNewWallet(newWallet);
            setActiveAccount(acc);
            setWallet(newWallet);
            navigation.reset({
              routes: [{ name: "(tabs)" }],
            });
          },
        },
      ]
    );
  }, [mnemonic, addNewWallet, setActiveAccount, setWallet, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.warningBox}>
          <AntDesign name="warning" size={24} color="#FFD700" />
          <Text style={styles.warningText}>
            Write down your seed phrase and store it in a safe place. You'll
            need it to recover your wallet.
          </Text>
        </View>

        <View style={styles.seedPhraseContainer}>
          <View style={styles.seedPhraseHeader}>
            <Text style={styles.title}>Your Seed Phrase</Text>
            <Pressable onPress={copyToClipboard} style={styles.copyButton}>
              <AntDesign name="copy1" size={20} color="#007AFF" />
              {copiedText ? (
                <Text style={styles.copiedText}>{copiedText}</Text>
              ) : (
                <Text style={styles.copyText}>Copy</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.seedPhrase}>
            {mnemonic.split(" ").map((word, idx) => (
              <View key={word + idx} style={styles.wordContainer}>
                <Text style={styles.wordNumber}>{idx + 1}</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <AntDesign name="infocirlce" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            Never share your seed phrase with anyone or enter it into any form
            or website.
          </Text>
        </View>
      </View>

      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>I've Saved My Seed Phrase</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    padding: 20,
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
  seedPhraseContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  seedPhraseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  copyText: {
    color: "#007AFF",
    fontSize: 14,
    marginLeft: 4,
  },
  copiedText: {
    color: "#32CD32",
    fontSize: 14,
    marginLeft: 4,
  },
  seedPhrase: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoText: {
    color: "#007AFF",
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    margin: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default NewSeedPhraseScreen;
