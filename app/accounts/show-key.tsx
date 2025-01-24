import EncryptedStore from "@/encryption/EncryptedStore";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { ChainData } from "@/types/network";
import { joinStrings } from "@/utils/string/join";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ShowKeyScreen = () => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ChainData | null>(null);
  const [isChainModalVisible, setIsChainModalVisible] = useState(true);

  const { chains } = useChainsStore();
  const { accounts, activeId } = useCurrentStore();

  // Filter chains based on the active account's supported networks
  const supportedChains = useMemo(() => {
    const activeAccount = accounts[activeId];
    if (!activeAccount) return [];

    return Object.values(chains).filter((chain) =>
      activeAccount.networks.includes(chain.type)
    );
  }, [chains, accounts, activeId]);

  const handleBack = () => {
    router.back();
  };

  const handleSelectChain = (chain: ChainData) => {
    setSelectedChain(chain);
    setIsChainModalVisible(false);
  };

  const handleReveal = async () => {
    if (!selectedChain) return;

    try {
      const key = (await EncryptedStore.decryptAndRetrieve(
        joinStrings(activeId, selectedChain.type),
        "1234"
      )) as string;
      setPrivateKey(key);
      setIsVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve private key");
    }
  };

  const handleCopy = async () => {
    if (!privateKey) return;
    await Share.share({
      message: privateKey,
    });
  };

  const ChainSelectionModal = () => (
    <Modal visible={isChainModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Network</Text>
          <ScrollView>
            {supportedChains.map((chain) => (
              <TouchableOpacity
                key={chain.chainId}
                style={styles.chainItem}
                onPress={() => handleSelectChain(chain)}
              >
                <Text style={styles.chainName}>{chain.displayName}</Text>
                <Text style={styles.chainId}>Chain ID: {chain.chainId}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ChainSelectionModal />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedChain
            ? `Private Key - ${selectedChain.displayName}`
            : "Private Key"}
        </Text>
        <TouchableOpacity
          onPress={handleCopy}
          style={styles.headerButton}
          disabled={!isVisible}
        >
          <MaterialIcons
            name="content-copy"
            size={24}
            color={isVisible ? "white" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <MaterialIcons name="warning" size={24} color="#ff9800" />
          <Text style={styles.warningText}>
            Never share your private key. Anyone with this key can take your
            assets.
          </Text>
        </View>

        {!selectedChain ? (
          <Text style={styles.selectChainText}>
            Please select a network to reveal its private key
          </Text>
        ) : !isVisible ? (
          <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
            <Text style={styles.revealButtonText}>Reveal Private Key</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.keyContainer}>
            <Text style={styles.keyText} selectable>
              {privateKey}
            </Text>
          </View>
        )}

        {isVisible && (
          <View style={styles.securityCard}>
            <MaterialIcons name="security" size={24} color="#4CAF50" />
            <Text style={styles.securityText}>
              Store this private key in a secure location. Never share it with
              anyone or enter it into unverified websites.
            </Text>
          </View>
        )}
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
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningCard: {
    backgroundColor: "#332b00",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    color: "#ff9800",
    fontSize: 14,
    flex: 1,
  },
  revealButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  revealButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  keyContainer: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  keyText: {
    color: "white",
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 12,
  },
  networkLabel: {
    color: "#999",
    fontSize: 14,
    textAlign: "right",
  },
  securityCard: {
    backgroundColor: "#1b3320",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  securityText: {
    color: "#4CAF50",
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  chainItem: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  chainName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  chainId: {
    color: "#999",
    fontSize: 14,
    marginTop: 5,
  },
  selectChainText: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default ShowKeyScreen;
