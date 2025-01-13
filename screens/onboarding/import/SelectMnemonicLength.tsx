import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PhraseLength = 12 | 15 | 24;

const SelectMnemonicLength = ({
  handleLengthSelect,
}: {
  handleLengthSelect: (length: PhraseLength) => void;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#1A1A1A", "#121212"]} style={styles.gradient} />

      <View style={styles.content}>
        <Text style={styles.title}>Select Seed Phrase Length</Text>
        <Text style={styles.subtitle}>
          Choose the length of your recovery phrase
        </Text>

        {[12, 15, 24].map((length) => (
          <TouchableOpacity
            key={length}
            style={styles.lengthOption}
            onPress={() => handleLengthSelect(length as PhraseLength)}
          >
            <LinearGradient
              colors={["#2A2A2A", "#232323"]}
              style={styles.lengthGradient}
            >
              <Text style={styles.lengthText}>{length} Words</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#666" />
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
});

export default SelectMnemonicLength;
