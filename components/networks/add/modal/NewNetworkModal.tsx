import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import { JsonRpcProvider } from "ethers";
import { X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NetworkModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NetworkDetails {
  name: string;
  chainId: string;
  type: Networks;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  logo: string;
  category: NetworkCategory;
  rpcUrls: string[];
  blockExplorerUrl: string;
}

const NewNetworkModal: React.FC<NetworkModalProps> = ({ visible, onClose }) => {
  const { addNewChain } = useChainsStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(-1);

  const [networkDetails, setNetworkDetails] = useState<NetworkDetails>({
    name: "",
    chainId: "",
    type: Networks.EVM,
    nativeCurrency: { name: "", symbol: "", decimals: 18 },
    logo: "",
    category: NetworkCategory.CUSTOM,
    rpcUrls: [""],
    blockExplorerUrl: "",
  });

  const [isDataValid, setIsDataValid] = useState(false);

  React.useEffect(() => {
    const keyboardWillShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    const keyboardWillHide = () => {
      setKeyboardHeight(0);
      setCurrentInputIndex(-1);
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleInputChange = (
    field: keyof NetworkDetails | "rpcUrl",
    value: string
  ) => {
    if (field === "rpcUrl") {
      setNetworkDetails((prev) => ({
        ...prev,
        rpcUrls: [value],
      }));
      validateRpcUrl(value);
    } else {
      setNetworkDetails((prev) => ({
        ...prev,
        [field]: field === "chainId" ? value.replace(/[^0-9]/g, "") : value,
      }));
    }
  };

  const validateRpcUrl = async (url: string) => {
    if (!url) {
      setIsDataValid(false);
      return;
    }

    try {
      const provider = new JsonRpcProvider(url, undefined, {
        staticNetwork: true,
      });
      const chainDetails = await provider.getNetwork();
      const chainIdStr = chainDetails.chainId.toString();

      setNetworkDetails((prev) => ({
        ...prev,
        chainId: chainIdStr,
      }));
      setIsDataValid(true);
    } catch (e) {
      console.log("RPC validation error:", e);
      setIsDataValid(false);
    }
  };

  const handleSave = () => {
    const formattedData: ChainData = {
      ...networkDetails,
      displayName: networkDetails.name,
      chainId: parseInt(networkDetails.chainId, 10),
    };
    addNewChain(formattedData);
    onClose();
  };

  const formFields = [
    {
      label: "Network Name",
      field: "name" as const,
      placeholder: "Enter network name",
      keyboardType: "default" as const,
      value: networkDetails.name,
    },
    {
      label: "Chain ID",
      field: "chainId" as const,
      placeholder: "Enter chain ID",
      keyboardType: "numeric" as const,
      value: networkDetails.chainId,
    },
    {
      label: "Currency Symbol",
      field: "nativeCurrency" as const,
      placeholder: "Enter currency symbol",
      keyboardType: "default" as const,
      value: networkDetails.nativeCurrency.symbol,
    },
    {
      label: "RPC URL",
      field: "rpcUrl" as const,
      placeholder: "Enter RPC URL",
      keyboardType: "default" as const,
      value: networkDetails.rpcUrls[0],
    },
    {
      label: "Block Explorer URL",
      field: "blockExplorerUrl" as const,
      placeholder: "Enter block explorer URL",
      keyboardType: "default" as const,
      value: networkDetails.blockExplorerUrl,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.editContainer]}>
          <View style={styles.optionsHeader}>
            <Text style={styles.optionsTitle}>Add New Network</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.editFields}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {formFields.map((field, index) => (
              <View key={field.field} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    currentInputIndex === index && styles.focusedInput,
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#666"
                  keyboardType={field.keyboardType}
                  value={field.value}
                  onChangeText={(text) => handleInputChange(field.field, text)}
                />
                {field.field === "rpcUrl" && !isDataValid && field.value && (
                  <Text style={styles.errorText}>Invalid RPC URL</Text>
                )}
              </View>
            ))}
            <View style={{ height: keyboardHeight + 20 }} />
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.saveButton,
                !isDataValid && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={!isDataValid}
            >
              <Text style={styles.actionButtonText}>Add Network</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  editContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    overflowY: "scroll",
    maxHeight: 400,
  },
  optionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  closeButton: {
    padding: 8,
  },
  editFields: {
    flexGrow: 0,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    color: "#999",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  focusedInput: {
    borderColor: "#007AFF",
    backgroundColor: "#3a3a3a",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NewNetworkModal;
