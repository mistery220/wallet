// RequestScreen.tsx
import RequestInputContainer from "@/components/screens/request/RequestInputContainer";
import TokenRequestContainer from "@/components/screens/request/TokenRequestContainer";
import { useChainsStore } from "@/store/chains";
import { useFormStore } from "@/store/form";
import { validateAddress } from "@/utils/tokens/address";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RequestScreen() {
  const { from: fromToken } = useFormStore();
  const { chains } = useChainsStore();

  const [requesterAddress, setRequesterAddress] = useState("");
  const [error, setError] = useState("");

  const handleRequest = async () => {
    if (!fromToken.assets || !fromToken.amount) {
      return;
    }

    if (!requesterAddress.trim()) {
      setError("Please enter an address to request from");
      return;
    }

    if (
      !validateAddress(requesterAddress, chains[fromToken.assets.chainId].type)
    ) {
      setError("Please enter a valid address");
      return;
    }

    setError("");
    // Here you can implement the logic to generate a request link or notification
    // router.push(
    //   `/request/preview?chainId=${fromToken.assets.chainId}&amount=${fromToken.amount}&address=${requesterAddress}`
    // );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.boxContainer}>
            {/* Token Request Section */}
            <TokenRequestContainer />

            {/* Request Input Section */}
            <RequestInputContainer
              requesterAddress={requesterAddress}
              setRequesterAddress={setRequesterAddress}
              error={error}
              setError={setError}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.requestButton,
              (!requesterAddress || !fromToken.amount || !fromToken.assets) &&
                styles.disabledButton,
            ]}
            onPress={handleRequest}
            disabled={
              !requesterAddress || !fromToken.amount || !fromToken.assets
            }
          >
            <Text style={styles.requestButtonText}>Generate Request</Text>
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
  },
  content: {
    flex: 1,
  },
  boxContainer: {
    padding: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  requestButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  requestButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
