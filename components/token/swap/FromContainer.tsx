import { useFormStore } from "@/store/form";
import { formatAndTrimUnits } from "@/utils/general/formatter";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import TokenSelection from "../TokenSelection";

const FromContainer = ({
  payAmount,
  setPayAmount,
}: {
  payAmount: string;
  setPayAmount: (val: string) => void;
}) => {
  const { from: fromToken } = useFormStore();
  return (
    <View style={styles.swapBox}>
      <Text style={styles.sectionTitle}>You Pay</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.amountInput}
          value={payAmount}
          onChangeText={setPayAmount}
          placeholder="0"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
        <TokenSelection
          token={fromToken}
          onPress={() => router.push("/tokens/from")}
        />
      </View>
      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.dollarValue}>$0</Text>
        </View>
        {fromToken && (
          <View style={styles.rateRow}>
            <Text style={styles.rateNumber}>
              {formatAndTrimUnits(fromToken.bal, fromToken.decimals)}
            </Text>
            <Pressable style={styles.rateButton}>
              <Text style={styles.rateText}>50%</Text>
            </Pressable>
            <Pressable style={styles.rateButton}>
              <Text style={styles.rateText}>Max</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default FromContainer;

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
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rateRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  rateButton: {
    backgroundColor: "#3C3C3C",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rateNumber: {
    color: "#999",
    fontSize: 16,
    marginRight: 8,
  },
  rateText: {
    color: "#999",
    fontSize: 14,
  },
  dollarValue: {
    color: "#666",
    fontSize: 16,
  },
});
