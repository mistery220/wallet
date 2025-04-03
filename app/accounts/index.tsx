import { Networks } from "@/enums/network/ecosystem";
import { useCurrentStore } from "@/store/current";
import { Account } from "@/types/wallet/account";
import { joinStrings } from "@/utils/string/join";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
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

const EditAccountScreen = () => {
  const { accountId } = useLocalSearchParams();
  const accId = accountId as string;
  const { accounts } = useCurrentStore();

  const handleBack = () => {
    router.back();
  };

  const handleAccountNamePress = () => {
    router.push(`/accounts/edit-name?accountId=${accId}`);
  };

  const handleAccountAddressesPress = () => {
    router.push(`/accounts/addresses?accountId=${accId}`);
  };

  const handleShowSecretPhrase = () => {
    router.push(`/accounts/show-phrase?storeName=${accounts[accId].walletId}`);
  };

  const handleShowPrivateKey = (network: Networks) => {
    router.push(`/accounts/show-key?storeName=${joinStrings(accId, network)}`);
  };

  const handleRemoveAccount = (account: Account) => {
    // Implement account removal logic
    // Should show confirmation dialog first
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Account</Text>
        <View style={styles.backButton} /> {/* Empty view for spacing */}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.accountIcon}>
          <Text style={styles.accountIconText}>A1</Text>
          <TouchableOpacity style={styles.editIconButton}>
            <Text>
              <MaterialIcons name="edit" size={20} color="white" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAccountNamePress()}
          >
            <Text style={styles.menuLabel}>Account Name</Text>
            <View style={styles.menuValue}>
              <Text style={styles.menuValueText}>Account 1</Text>
              <Text>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleAccountAddressesPress()}
          >
            <Text style={styles.menuLabel}>Account Addresses</Text>
            <View style={styles.menuValue}>
              <Text style={styles.menuValueText}>
                {accounts[accId]?.networks?.length || 0}
              </Text>
              <Text>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleShowSecretPhrase()}
          >
            <Text style={styles.menuLabel}>Show Secret Phrase</Text>
            <Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            // @TODO add the network selection modal
            onPress={() => handleShowPrivateKey(Networks.EVM)}
          >
            <Text style={styles.menuLabel}>Show Private Key</Text>
            <Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveAccount(accounts[0])}
          >
            <Text style={styles.removeButtonText}>Remove Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  accountIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  accountIconText: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
  editIconButton: {
    position: "absolute",
    right: -4,
    bottom: -4,
    backgroundColor: "#444",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#333",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  menuLabel: {
    color: "white",
    fontSize: 16,
  },
  menuValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuValueText: {
    color: "#999",
    fontSize: 16,
  },
  removeButton: {
    padding: 16,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EditAccountScreen;
