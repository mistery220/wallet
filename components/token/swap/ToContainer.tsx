import { useFormStore } from "@/store/form";
import { QuoteResponse } from "@/types/quotes/response";
import { formatAndTrimUnits } from "@/utils/general/formatter";
import { joinStrings } from "@/utils/string/join";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TokenSelection from "../TokenSelection";

const ToContainer = ({
  buildTxnData,
  title,
  isQuoteLoading,
  quoteResponse,
}: {
  isQuoteLoading: boolean;
  buildTxnData: () => void;
  title: string;
  quoteResponse?: QuoteResponse;
}) => {
  const { to: toToken, setToToken } = useFormStore();
  return (
    <View style={styles.swapBox}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.amountInput}
          value={toToken.amount}
          onChangeText={(val) => {
            setToToken({ ...toToken, amount: val });
          }}
          placeholder="0"
          onBlur={buildTxnData}
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
        <TokenSelection
          token={toToken}
          onPress={() => router.push("/tokens/to")}
        />
      </View>
      {isQuoteLoading ? (
        <Text style={styles.dollarValue}>Loading..</Text>
      ) : toToken.assets &&
        quoteResponse?.to[
          joinStrings(toToken.assets.chainId, toToken.assets.address)
        ] ? (
        <Text style={styles.dollarValue}>
          $Dollar Value
        </Text>
      ) : (
        <Text style={styles.dollarValue}>$0</Text>
      )}
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
