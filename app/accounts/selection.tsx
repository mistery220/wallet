import WalletKitClient from "@/clients/walletKit/WalletKit";
import { useCurrentStore } from "@/store/current";
import { Account } from "@/types/wallet/account";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Selection() {
  const { wcUri } = useLocalSearchParams();
  const { accounts, updateAllAccounts } = useCurrentStore();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const [allAccounts, setAllAccounts] =
    useState<Record<string, Account>>(accounts);

  // Initialize the first account as selected by default
  useEffect(() => {
    if (accounts && Object.keys(accounts).length > 0) {
      const updatedAccounts = { ...accounts };

      // Set isSelectedToConnect to true for the first account only
      Object.keys(updatedAccounts).forEach((id, index) => {
        updatedAccounts[id] = {
          ...updatedAccounts[id],
          isSelectedToConnect: index === 0,
        };
      });

      setAllAccounts(updatedAccounts);
    }
  }, [accounts]);

  // Check if any account is selected
  const hasSelectedAccounts = useMemo(() => {
    return Object.values(allAccounts).some(
      (account) => account.isSelectedToConnect
    );
  }, [allAccounts]);

  const handleBack = async () => {
    router.back();
  };

  const handleConnect = () => {
    setIsConnecting(true);
    updateAllAccounts(allAccounts);
    try {
      const ecosystemWiseAddresses = Object.values(allAccounts).reduce(
        (acc, account) => {
          if (account.isSelectedToConnect) {
            Object.entries(account.address).forEach(([network, address]) => {
              if (acc[network]) {
                acc[network] = [...acc[network], address];
              } else {
                acc[network] = [address];
              }
            });
          }
          return acc;
        },
        {} as Record<string, string[]>
      );
      console.log({ ecosystemWiseAddresses });
      // WalletKitClient.sessionProposal();
      // await WalletKitClient.walletKit.pair({ uri: wcUri.toString() });
    } catch (e) {
      console.log({ e });
    }
    setIsConnecting(false);
    router.back();
  };

  const toggleAccountSelection = (accountId: string) => {
    setAllAccounts((prev) => ({
      ...prev,
      [accountId]: {
        ...prev[accountId],
        isSelectedToConnect: !prev[accountId].isSelectedToConnect,
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select Accounts</Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Select which accounts you want to share with this dApp
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(allAccounts).map(([id, account]) => (
          <TouchableOpacity
            key={id}
            style={styles.accountCard}
            onPress={() => toggleAccountSelection(id)}
          >
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              {account.networks && account.networks[0] && account.address && (
                <Text style={styles.accountAddress}>
                  {account.address[account.networks[0]]
                    ? `${account.address[account.networks[0]].substring(
                        0,
                        8
                      )}...${account.address[account.networks[0]].substring(
                        account.address[account.networks[0]].length - 6
                      )}`
                    : "No address available"}
                </Text>
              )}
            </View>
            <View
              style={[
                styles.checkbox,
                account.isSelectedToConnect ? styles.checkboxSelected : {},
              ]}
            >
              {account.isSelectedToConnect && (
                <MaterialIcons name="check" size={18} color="white" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.connectButton,
            !hasSelectedAccounts && styles.connectButtonDisabled,
          ]}
          onPress={handleConnect}
          disabled={!hasSelectedAccounts || isConnecting}
        >
          <Text style={styles.connectButtonText}>
            {isConnecting ? "Connecting" : "Connect"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginTop: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  infoText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  accountCard: {
    backgroundColor: "#333",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  accountAddress: {
    color: "#999",
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  checkboxSelected: {
    backgroundColor: "#3377FF",
    borderColor: "#3377FF",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  connectButton: {
    backgroundColor: "#3377FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  connectButtonDisabled: {
    backgroundColor: "#333",
    opacity: 0.6,
  },
  connectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
