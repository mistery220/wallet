import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import SelectMnemonicLength from "./SelectMnemonicLength";

type PhraseLength = 12 | 15 | 24;

const ExistingWallet: React.FC = () => {
  const [selectedLength, setSelectedLength] = useState<PhraseLength | null>(
    null
  );
  const [phrases, setPhrases] = useState<string[]>([]);
  const [showPhrases, setShowPhrases] = useState<boolean[]>([]);
  const [invalidIndices, setInvalidIndices] = useState<number[]>([]);
  const inputRefs = useRef<TextInput[]>([]);

  const handleLengthSelect = (length: PhraseLength) => {
    setSelectedLength(length);
    setPhrases(new Array(length).fill(""));
    setShowPhrases(new Array(length).fill(false));
    setInvalidIndices([]);
  };

  const toggleShowPhrase = (index: number) => {
    const newShowPhrases = [...showPhrases];
    newShowPhrases[index] = !newShowPhrases[index];
    setShowPhrases(newShowPhrases);
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      const words = text.toLowerCase().trim().split(/\s+/);

      if (!selectedLength) {
        Alert.alert("Error", "Please select a seed phrase length first");
        return;
      }

      if (words.length !== selectedLength) {
        Alert.alert(
          "Invalid Length",
          `Expected ${selectedLength} words but found ${words.length} words.`
        );
        return;
      }

      setPhrases(words);
      setShowPhrases(new Array(selectedLength).fill(false));
      setInvalidIndices([]);
    } catch (error) {
      Alert.alert("Error", "Failed to paste from clipboard");
    }
  };

  const handlePhraseChange = (text: string, index: number) => {
    const newPhrases = [...phrases];
    newPhrases[index] = text.toLowerCase().trim();
    setPhrases(newPhrases);

    if (text && index < phrases.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const validateSeedPhrase = () => {
    const invalidWords = phrases.reduce((acc, phrase, index) => {
      if (!phrase.match(/^[a-z]+$/)) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);

    if (invalidWords.length > 0) {
      setInvalidIndices(invalidWords);
      inputRefs.current[invalidWords[0]]?.focus();
      Alert.alert(
        "Invalid Words",
        "Please check the highlighted words and try again."
      );
      return;
    }

    router.push("/profile");
  };

  if (!selectedLength) {
    return (
      <SelectMnemonicLength handleLengthSelect={handleLengthSelect} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#1A1A1A", "#121212"]}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedLength(null)}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Seed Phrase</Text>
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={() => setShowPhrases((prev) => prev.map(() => !prev[0]))}
        >
          <MaterialIcons
            name={showPhrases[0] ? "visibility-off" : "visibility"}
            size={24} color="white"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn} style={styles.pasteContainer}>
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <MaterialIcons name="content-paste" size={20} color="white" />
            <Text style={styles.pasteText}>Paste Seed Phrase</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.gridContainer}>
          {phrases.map((phrase, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 50)}
              style={[
                styles.phraseContainer,
                invalidIndices.includes(index) && styles.invalidPhrase,
              ]}
            >
              <Text style={styles.phraseNumber}>{index + 1}</Text>
              <TextInput
                ref={(el) => (inputRefs.current[index] = el as TextInput)}
                style={styles.phraseInput}
                value={phrase}
                onChangeText={(text) => handlePhraseChange(text, index)}
                secureTextEntry={!showPhrases[index]}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={`Word ${index + 1}`}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                onPress={() => toggleShowPhrase(index)}
                style={styles.visibilityToggle}
              >
                <MaterialIcons
                  name={showPhrases[index] ? "visibility-off" : "visibility"}
                  size={20} color="#666"
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateSeedPhrase}
        >
          <LinearGradient
            colors={["#2A2A2A", "#232323"]}
            style={styles.submitGradient}
          >
            <Text style={styles.submitText}>Import Wallet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  visibilityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
  },
  lengthOption: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  lengthGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  lengthText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  phraseContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  invalidPhrase: {
    borderColor: "#FF4444",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  phraseNumber: {
    color: "#666",
    fontSize: 12,
    marginRight: 8,
    width: 20,
  },
  phraseInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    padding: 0,
  },
  visibilityToggle: {
    padding: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  submitGradient: {
    padding: 16,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pasteContainer: {
    marginBottom: 20,
  },
  pasteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  pasteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ExistingWallet;
