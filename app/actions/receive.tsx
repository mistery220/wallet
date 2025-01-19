import CustomImg from "@/components/image/CustomImg";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { ChainData } from "@/types/network";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Network {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  address: string;
}

const NetworkItem = ({ chain }: { chain: ChainData }) => {
  const { activeId, accounts } = useCurrentStore();
  const active = accounts[activeId];
  const handleCopy = (): void => {
    // Implement copy functionality
    console.log("Copying address:", active.address[chain.type]);
  };

  const handleQRCode = (): void => {
    // Implement QR code functionality
    console.log("Showing QR code for:", active.address[chain.type]);
  };

  return (
    <TouchableOpacity style={styles.networkItem}>
      <View style={styles.networkInfo}>
        <CustomImg uri={chain.logo} style={styles.networkIcon} />
        <View style={styles.networkText}>
          <Text style={styles.networkName}>{chain.name}</Text>
          <Text style={styles.networkAddress}>
            {active.address[chain.type]}
          </Text>
        </View>
      </View>
      <View style={styles.networkActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleQRCode}>
          <Ionicons name="qr-code" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ReceiveScreen: React.FC = () => {
  const { chains } = useChainsStore();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Your Addresses</Text>
      <View style={styles.networksList}>
        {Object.values(chains).map((chain) => (
          <NetworkItem chain={chain} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginVertical: 16,
  },
  networksList: {
    gap: 12,
  },
  networkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
  },
  networkItemSelected: {
    backgroundColor: "#333",
  },
  networkInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  networkText: {
    marginLeft: 12,
  },
  networkName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  networkAddress: {
    color: "#999",
    fontSize: 14,
  },
  networkActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3A3A3A",
    justifyContent: "center",
    alignItems: "center",
  },
  requestSection: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  requestTypeToggle: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#3A3A3A",
  },
  toggleButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
  },
  requestButton: {
    backgroundColor: "#7C4DFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ReceiveScreen;
