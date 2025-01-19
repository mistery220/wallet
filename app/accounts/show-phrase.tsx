import EncryptedStore from "@/encryption/EncryptedStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ShowPhraseScreen = () => {
  const { storeName } = useLocalSearchParams();
  const [phrase, setPhrase] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleReveal = async () => {
    try {
      const secretPhrase = (await EncryptedStore.decryptAndRetrieve(
        storeName as string,
        "1234"
      )) as string;
      setPhrase(secretPhrase.split(" "));
      setIsVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve secret phrase");
    }
  };

  const handleCopy = async () => {
    if (!phrase.length) return;
    await Share.share({
      message: phrase.join(" "),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secret Recovery Phrase</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.headerButton}>
          <MaterialIcons name="content-copy" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={24} color="#ff9800" />
          <Text style={styles.warningText}>
            Never share your secret recovery phrase. Anyone with this phrase can
            take your assets.
          </Text>
        </View>

        {!isVisible ? (
          <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
            <Text style={styles.revealButtonText}>Reveal Secret Phrase</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.phraseContainer}>
            {phrase.map((word, index) => (
              <View key={index} style={styles.wordCard}>
                <Text style={styles.wordNumber}>{index + 1}</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningCard: {
    backgroundColor: "#332b00",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    color: "#ff9800",
    fontSize: 14,
    flex: 1,
  },
  revealButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  revealButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  phraseContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  wordCard: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  wordNumber: {
    color: "#666",
    fontSize: 12,
    width: 20,
  },
  word: {
    color: "white",
    fontSize: 16,
  },
});

export default ShowPhraseScreen;
