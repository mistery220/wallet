import RequestInputContainer from "@/components/screens/request/RequestInputContainer";
import TokenRequestContainer from "@/components/screens/request/TokenRequestContainer";
import { Actions } from "@/enums/actions";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { useFormStore } from "@/store/form";
import { RequestActionNotification } from "@/types/notification/actions";
import { validateAddressByNetwork } from "@/utils/tokens/address";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RequestScreen() {
  const { to: toToken } = useFormStore();
  const { chains } = useChainsStore();
  const { accounts, activeId } = useCurrentStore();
  const [requesterAddress, setRequesterAddress] = useState("");
  const [error, setError] = useState("");
  const [qrModalVisible, setQRModalVisible] = useState(false);

  const handleRequest = async () => {
    if (!toToken.assets || !toToken.amount) {
      return;
    }

    if (!requesterAddress.trim()) {
      setError("Please enter an address to request from");
      return;
    }

    if (
      !validateAddressByNetwork(
        requesterAddress,
        chains[toToken.assets.chainId].type
      )
    ) {
      setError("Please enter a valid address");
      return;
    }

    setError("");
    // Here you can implement the logic to generate a request link or notification
    try {
      // @TODO possibly just get the recipient, expoPushToken from backend
      // and notify from frontend only
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER}/actions/request`,
        {
          title: "Funds Required",
          data: {
            backRoute: "(tabs)",
            screenRoute: `${process.env.EXPO_PUBLIC_APP}/actions/send`,
            toToken: toToken,
            type: Actions.Request,
            recipient: requesterAddress,
          } as RequestActionNotification,
          body: "Request USDC from you",
        }
      );
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Request Funds</Text>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => {
                router.replace("/(app)/accounts/active");
              }}
              accessibilityLabel="Show my QR code"
            >
              <Ionicons name="qr-code" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

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
              (!requesterAddress || !toToken.amount || !toToken.assets) &&
                styles.disabledButton,
            ]}
            onPress={handleRequest}
            disabled={!requesterAddress || !toToken.amount || !toToken.assets}
          >
            <Text style={styles.requestButtonText}>Request</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  qrButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
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
