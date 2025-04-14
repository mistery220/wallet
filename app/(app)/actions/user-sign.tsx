import WalletKitClient from "@/clients/walletKit/WalletKit";
import useWalletClient from "@/hooks/clients/useWalletClient";
import { useSignatureActionStore } from "@/store/signatures/sign";
import { hexToUtf8 } from "@/utils/string/hexstring";
import { getEcosystemFromWcChainId } from "@/utils/walletconnect/ecosystem";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sign } from "viem/accounts";

const ActionScreen = () => {
  const insets = useSafeAreaInsets();
  const { getWalletClientResponse } = useWalletClient();
  const { signData, removeSignDataFromFront } = useSignatureActionStore();
  const { topic, params, id } = signData[0];
  const { request, chainId: wcChainId } = params;
  const requestParamsMessage = request.params[0];

  console.log({ params });

  // convert `requestParamsMessage` by using a method like hexToUtf8
  const message = hexToUtf8(requestParamsMessage);

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  const onConfirm = async () => {
    const [wcNetwork, chainId] = wcChainId.split(":");
    const ecosystem = getEcosystemFromWcChainId(wcNetwork);
    const signature = await getWalletClientResponse({
      chainId,
      ecosystem,
      params,
    });
    console.log(signature);
    const response = signature
      ? { id, result: signature, jsonrpc: "2.0" }
      : {
          id,
          jsonrpc: "2.0",
          error: {
            code: 5000,
            message: "User rejected.",
          },
        };

    await WalletKitClient.walletKit.respondSessionRequest({
      topic,
      response,
    });
    removeSignDataFromFront();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Extra padding view to account for status bar height */}
      <View style={{ height: insets.top, backgroundColor: "#1a1a1a" }} />

      <View style={styles.screenContainer}>
        {/* Header with back button */}
        <View style={styles.navigationHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Transaction Details</Text>
          <View style={styles.placeholderRight} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.siteInfo}>
              <View style={styles.siteIconContainer}>
                {/* Using a placeholder for the site icon */}
                <View style={styles.placeholder}>
                  <MaterialIcons name="public" size={24} color="white" />
                </View>
              </View>
              <View>
                <Text style={styles.siteName}>Website Name</Text>
                <Text style={styles.siteUrl}>website.example.com</Text>
              </View>
            </View>
            <Text style={styles.transactionType}>Signature Request</Text>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>From</Text>
              <View style={styles.detailValue}>
                <Text style={styles.tokenAmount}>Your Wallet</Text>
                <Text style={styles.usdValue}>0x1234...5678</Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-downward" size={24} color="#999" />
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>To</Text>
              <View style={styles.detailValue}>
                <Text style={styles.tokenAmount}>Recipient</Text>
                <Text style={styles.usdValue}>0xabcd...efgh</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.feeSection}>
            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Estimated Gas Fee</Text>
              <View style={styles.feeValue}>
                <Text style={styles.feeAmount}>0.0005 ETH</Text>
                <Text style={styles.feeUsdValue}>$1.25</Text>
              </View>
            </View>

            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Total Fee</Text>
              <View style={styles.feeValue}>
                <Text style={styles.feeAmount}>0.0005 ETH</Text>
                <Text style={styles.feeUsdValue}>$1.25</Text>
              </View>
            </View>
          </View>

          {/* Message section */}
          <View style={styles.sectionDivider} />

          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>Message</Text>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.buttonsContainer,
            { paddingBottom: insets.bottom || 20 },
          ]}
        >
          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholderRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 16,
  },
  siteInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  siteIconContainer: {
    marginRight: 12,
  },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  siteName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  siteUrl: {
    color: "#999",
    fontSize: 14,
  },
  transactionType: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {},
  tokenAmount: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  usdValue: {
    color: "#999",
    fontSize: 14,
  },
  arrowContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  feeSection: {
    marginBottom: 20,
  },
  feeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  feeLabel: {
    color: "#999",
    fontSize: 14,
  },
  feeValue: {
    alignItems: "flex-end",
  },
  feeAmount: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  feeUsdValue: {
    color: "#999",
    fontSize: 12,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  messageContainer: {
    backgroundColor: "#292929",
    borderRadius: 12,
    padding: 16,
  },
  messageText: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#5a5cdb",
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ActionScreen;
