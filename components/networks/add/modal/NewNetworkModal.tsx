import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { ChainData } from "@/types/network";
import { JsonRpcProvider } from "ethers";
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
};

type ChainDataInput = {
  name: string;
  chainId: string;
  type: Networks;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  logo: string;
  category: NetworkCategory;
  rpcUrls: string[];
  blockExplorerUrl: string;
};

const NewNetworkModal: React.FC<NewNetworkModalProps> = ({
  visible,
  onClose,
}) => {
  const [networkDetails, setNetworkDetails] = useState<ChainDataInput>({
    name: "",
    chainId: "",
    type: Networks.EVM,
    nativeCurrency: { name: "", symbol: "", decimals: 18 },
    logo: "",
    category: NetworkCategory.CUSTOM,
    rpcUrls: [],
    blockExplorerUrl: "",
  });

  const [isDataValid, setIsDataValid] = useState(false); // Track RPC validation status

  const handleInputChange = (
    field: string,
    value: string | number | object
  ) => {
    setNetworkDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "rpcUrls") {
      // Trigger RPC URL validation when the rpcUrls field is updated
      const rpcUrl = (value as string[])[0];
      validateRpcUrl(rpcUrl);
    }
  };

  const validateRpcUrl = async (url: string) => {
    try {
      const provider = new JsonRpcProvider(url, undefined, {
        staticNetwork: true,
      });
      const chainDetails = await provider.getNetwork();
      const chainIdStr = chainDetails.chainId.toString();
      if (chainIdStr === networkDetails.chainId) {
        setIsDataValid(true);
      } else {
        networkDetails.chainId = chainIdStr;
        setIsDataValid(true);
      }
    } catch (e) {
      console.log({ e });
      setIsDataValid(false);
    }
  };

  const handleAdd = () => {
    const formattedData: Partial<ChainData> = {
      ...networkDetails,
      chainId: parseInt(networkDetails.chainId, 10),
    };
    // @TODO addNetwork Implementation
    // onAddNetwork(formattedData);
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
              value={networkDetails.rpcUrls[0]}
              onChangeText={(text) => handleInputChange("rpcUrls", [text])}
            />
            {!isDataValid && networkDetails.rpcUrls?.[0]?.length > 0 && (
              <Text style={styles.errorText}>Invalid RPC URL</Text>
            )}
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
            <TouchableOpacity
              style={[styles.addButton, !isDataValid && styles.disabledButton]}
              onPress={handleAdd}
              disabled={!isDataValid}
            >
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
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
  disabledButton: {
    backgroundColor: "#aaa", // Gray out the button when disabled
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NewNetworkModal;
