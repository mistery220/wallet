import { ChainData } from "@/types/network";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type NewNetworkModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddNetwork: (data: ChainData) => void;
};

const NewNetworkModal: React.FC<NewNetworkModalProps> = ({
  visible,
  onClose,
  onAddNetwork,
}) => {
  const [networkDetails, setNetworkDetails] = useState({
    displayName: "",
    name: "",
    chainId: "",
    type: "mainnet", // Default to "mainnet" or "testnet"
    nativeCurrency: { name: "", symbol: "", decimals: 18 },
    logo: "",
    rpcUrls: { default: { http: [""] } },
    blockExplorerUrl: "",
  });

  const handleInputChange = (
    field: string,
    value: string | number | object
  ) => {
    setNetworkDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    const formattedData: ChainData = {
      ...networkDetails,
      chainId: parseInt(networkDetails.chainId, 10),
      mainnet: networkDetails.type === "mainnet",
    };
    onAddNetwork(formattedData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Network</Text>
          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Display Name"
              placeholderTextColor="#888"
              value={networkDetails.displayName}
              onChangeText={(text) => handleInputChange("displayName", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={networkDetails.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Chain ID"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={networkDetails.chainId}
              onChangeText={(text) => handleInputChange("chainId", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Native Currency Name"
              placeholderTextColor="#888"
              value={networkDetails.nativeCurrency.name}
              onChangeText={(text) =>
                handleInputChange("nativeCurrency", {
                  ...networkDetails.nativeCurrency,
                  name: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Native Currency Symbol"
              placeholderTextColor="#888"
              value={networkDetails.nativeCurrency.symbol}
              onChangeText={(text) =>
                handleInputChange("nativeCurrency", {
                  ...networkDetails.nativeCurrency,
                  symbol: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="RPC URL"
              placeholderTextColor="#888"
              value={networkDetails.rpcUrls.default.http[0]}
              onChangeText={(text) =>
                handleInputChange("rpcUrls", {
                  default: { http: [text] },
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Block Explorer URL"
              placeholderTextColor="#888"
              value={networkDetails.blockExplorerUrl}
              onChangeText={(text) =>
                handleInputChange("blockExplorerUrl", text)
              }
            />
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#1a73e8",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewNetworkModal;
