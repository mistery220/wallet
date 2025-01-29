// RequestScreen.tsx
import NotificationService from "@/clients/notification/NotificationService";
import RequestInputContainer from "@/components/screens/request/RequestInputContainer";
import TokenRequestContainer from "@/components/screens/request/TokenRequestContainer";
import { Actions } from "@/enums/notification/response";
import { usePushNotifications } from "@/hooks/notification/usePushNotification";
import { useChainsStore } from "@/store/chains";
import { useFormStore } from "@/store/form";
import { RequestActionNotification } from "@/types/notification/actions";
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
  const { to: toToken } = useFormStore();
  const { chains } = useChainsStore();
  const { expoPushToken } = usePushNotifications();

  const [requesterAddress, setRequesterAddress] = useState("");
  const [error, setError] = useState("");

  const handleRequest = async () => {
    await NotificationService.sendPushNotification({
      expoPushToken,
      title: "Funds Required",
      data: {
        backRoute: "(tabs)",
        screenRoute: "exp://192.168.1.11:8081/--/actions/send",
        toToken: toToken,
        type: Actions.Request,
        recipient: requesterAddress,
      } as RequestActionNotification,
      body: "Request USDC from you",
    });
    if (!toToken.assets || !toToken.amount) {
      return;
    }

    if (!requesterAddress.trim()) {
      setError("Please enter an address to request from");
      return;
    }

    if (
      !validateAddress(requesterAddress, chains[toToken.assets.chainId].type)
    ) {
      setError("Please enter a valid address");
      return;
    }

    setError("");
    // Here you can implement the logic to generate a request link or notification
    // router.push(
    //   `/request/preview?chainId=${toToken.assets.chainId}&amount=${toToken.amount}&address=${requesterAddress}`
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
              // (!requesterAddress || !toToken.amount || !toToken.assets) &&
              //   styles.disabledButton,
            ]}
            onPress={handleRequest}
            // disabled={
            //   !requesterAddress || !toToken.amount || !toToken.assets
            // }
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
