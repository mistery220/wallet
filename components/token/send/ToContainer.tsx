import { Skeleton } from "@/components/skeleton/Skeleton";
import { InputSrc } from "@/enums/form/input";
import { useFormStore } from "@/store/form";
import { QuoteResponse } from "@/types/quotes/response";
import { getInputFontSize } from "@/utils/styles/input";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import TokenSelection from "../TokenSelection";
import { chain } from "ramda";

const ToContainer = ({
  buildTxnData,
  title,
  isQuoteLoading,
}: {
  isQuoteLoading: boolean;
  buildTxnData: () => void;
  title: string;
  quoteResponse?: QuoteResponse;
}) => {
  const { to: toToken, setToToken, setInputSrc, from } = useFormStore();
  return (
    <View style={styles.swapBox}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
            setInputSrc(InputSrc.To);
            setToToken({ ...toToken, amount: val });
          }}
          placeholder="0"
          onBlur={buildTxnData}
          placeholderTextColor="#666"
          keyboardType="decimal-pad"
        />
        <TokenSelection
          token={toToken}
          onPress={() => {
            const chainId = toToken.assets?.chainId || from.assets?.chainId;
            if (chainId) {
              router.push(`/tokens/to?isSendAction=true&chainId=${chainId}`);
            } else {
              router.push(`/tokens/to?isSendAction=true`);
            }
          }}
        />
      </View>
      {isQuoteLoading ? (
        <Skeleton width={80} height={24} borderRadius={4} />
      ) : (
        <Text style={styles.dollarValue}>
          ${toToken.amount.length ? toToken.amount : "0"}
        </Text>
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
    minHeight: 60,
  },
  dollarValue: {
    color: "#666",
    fontSize: 16,
  },
});
