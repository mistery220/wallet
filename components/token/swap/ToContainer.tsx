import { useFormStore } from "@/store/form";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TokenSelection from "../TokenSelection";

const ToContainer = ({
  receiveAmount,
  setReceiveAmount,
  title,
}: {
  title: string;
  receiveAmount: string;
  setReceiveAmount: (val: string) => void;
}) => {
  const { to: toToken } = useFormStore();
  return (
    <View style={styles.swapBox}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.amountInput}
          value={receiveAmount}
          onChangeText={setReceiveAmount}
          placeholder="0"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
        <TokenSelection
          token={toToken}
          onPress={() => router.push("/tokens/to")}
        />
      </View>
      <Text style={styles.dollarValue}>$0</Text>
    </View>
  );
};

export default ToContainer;

const styles = StyleSheet.create({
  swapBox: {
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  dollarValue: {
    color: "#666",
    fontSize: 16,
  },
});
