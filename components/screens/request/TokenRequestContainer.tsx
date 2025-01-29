import TokenSelection from "@/components/token/TokenSelection";
import { InputSrc } from "@/enums/form/input";
import { useFormStore } from "@/store/form";
import { getInputFontSize } from "@/utils/styles/input";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const TokenRequestContainer = () => {
  const { to: toToken, setToToken, setInputSrc } = useFormStore();

  return (
    <View style={styles.requestBox}>
      <Text style={styles.sectionTitle}>Request Amount</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.amountInput,
            {
              fontSize: getInputFontSize(toToken.amount),
            },
          ]}
          value={toToken.amount}
          onChangeText={(val) => {
            setInputSrc(InputSrc.From);
            setToToken({ ...toToken, amount: val });
          }}
          placeholder="0"
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
        <TokenSelection
          token={toToken}
          onPress={() => router.push("/tokens/to")}
        />
      </View>
      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.dollarValue}>$0</Text>
        </View>
        {toToken.assets && (
          <Text style={styles.tokenSymbol}>{toToken.assets.symbol}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  requestBox: {
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    fontWeight: "600",
    minHeight: 60,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dollarValue: {
    color: "#666",
    fontSize: 16,
  },
  tokenSymbol: {
    color: "#999",
    fontSize: 16,
  },
});

export default TokenRequestContainer;
