import FromContainerSwap from "@/components/token/swap/FromContainer";
import ToContainerSwap from "@/components/token/swap/ToContainer";
import useBuildTxnData from "@/hooks/txn/builder/useBuildTxnData";
import useSendTxn from "@/hooks/txn/send/useSendTxn";
import { useChainsStore } from "@/store/chains";
import { useFormStore } from "@/store/form";
import { validateAddressByNetwork } from "@/utils/tokens/address";
import { AntDesign } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SendScreen() {
  const {
    from: fromToken,
    to: toToken,
    interchangeFormTokens,
    recipient,
    setRecipient,
  } = useFormStore();
  const { chains } = useChainsStore();

  const [error, setError] = useState("");
  const router = useRouter();

  const { sendToken } = useSendTxn();
  const { buildTxnData, quoteResponse, isQuoteLoading } = useBuildTxnData();

  async function txnBuilder() {
    buildTxnData({
      from: fromToken,
      to: toToken,
    });
  }

  const handleSend = async () => {
    // @TODO upate this to a function and use in button disable also.
    if (
      !fromToken.assets ||
      !fromToken.amount ||
      !toToken.amount ||
      !toToken.assets ||
      !quoteResponse
    )
      return;
    if (!recipient.trim()) {
      setError("Please enter a recipient address");
      return;
    }

    if (
      !validateAddressByNetwork(
        recipient,
        chains[fromToken.assets.chainId].type
      )
    ) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setError("");
    const hash = await sendToken(quoteResponse);
    router.push(
      `/transaction?chainId=${fromToken.assets.chainId}&hash=${hash}`
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* You Pay Section */}
          <FromContainerSwap
            quoteResponse={quoteResponse}
            buildTxnData={txnBuilder}
            isQuoteLoading={isQuoteLoading}
          />

          {/* Swap Icon */}
          <View style={styles.swapIconContainer}>
            <Pressable
              onPress={interchangeFormTokens}
              style={styles.swapButton}
            >
              <AntDesign name="swap" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* You Receive Section */}
          <ToContainerSwap
            isQuoteLoading={isQuoteLoading}
            buildTxnData={txnBuilder}
            quoteResponse={quoteResponse}
            title="You Receive"
          />
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.sendButton,
              (!recipient || !fromToken || !toToken) && styles.disabledButton,
            ]}
            onPress={handleSend}
            disabled={!recipient || !fromToken || !toToken}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    paddingTop: Constants.statusBarHeight,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3C3C3C",
    padding: 8,
    borderRadius: 24,
    minWidth: 120,
  },
  tokenIconContainer: {
    marginRight: 8,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#666",
  },
  tokenSelectorText: {
    color: "white",
    fontSize: 16,
    marginRight: 8,
    flex: 1,
  },

  swapIconContainer: {
    alignItems: "center",
    marginVertical: -16,
    zIndex: 1,
  },
  swapButton: {
    backgroundColor: "#4C4C4C",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  recipientContainer: {
    marginTop: 24,
  },
  recipientInput: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
