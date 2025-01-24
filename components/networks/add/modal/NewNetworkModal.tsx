import { NetworkCategory } from "@/enums/network/chains";
import { Networks } from "@/enums/network/ecosystem";
import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import { X } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
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
import { createPublicClient, http } from "viem";

interface NetworkModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NetworkDetails {
  displayName: string;
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
  const [currentInputIndex, setCurrentInputIndex] = useState<number>(-1);

  const [networkDetails, setNetworkDetails] = useState<NetworkDetails>({
    displayName: "",
    chainId: "",
    type: Networks.EVM,
    nativeCurrency: { name: "", symbol: "", decimals: 18 },
    logo: "",
    category: NetworkCategory.CUSTOM,
    rpcUrls: [""],
    blockExplorerUrl: "",
  });

  const [isDataValid, setIsDataValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [detectedChainId, setDetectedChainId] = useState<string | null>(null);

  const validateForm = useCallback(async () => {
    const errors: { [key: string]: string } = {};

    if (!networkDetails.displayName.trim()) {
      errors.displayName = "Network name is required";
    }

    if (!networkDetails.chainId.trim()) {
      errors.chainId = "Chain ID is required";
    }

    if (!networkDetails.nativeCurrency.symbol.trim()) {
      errors.nativeCurrency = "Currency symbol is required";
    }

    if (!networkDetails.rpcUrls[0].trim()) {
      errors.rpcUrl = "RPC URL is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [networkDetails]);

  const handleInputChange = (
    field: keyof NetworkDetails | "rpcUrl",
    value: string
  ) => {
    setIsDataValid(true);
    if (field === "rpcUrl") {
      setNetworkDetails((prev) => ({
        ...prev,
        rpcUrls: [value],
      }));
      // Clear any previous detected chain ID and validation state
      setDetectedChainId(null);
    } else if (field === "nativeCurrency") {
      setNetworkDetails((prev) => ({
        ...prev,
        nativeCurrency: { ...prev.nativeCurrency, symbol: value },
      }));
    } else {
      setNetworkDetails((prev) => ({
        ...prev,
        [field]: field === "chainId" ? value.replace(/[^0-9]/g, "") : value,
      }));
    }

    // Clear specific field error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateRpcUrl = async (url: string) => {
    if (!url) {
      setValidationErrors((prev) => ({
        ...prev,
        rpcUrl: "RPC URL is required",
      }));
      return false;
    }

    try {
      const publicClient = createPublicClient({
        transport: http(url),
      });
      const chainId = await publicClient.getChainId();

      // If user hasn't entered a chain ID or entered a different one
      if (
        !networkDetails.chainId ||
        Number(networkDetails.chainId) !== chainId
      ) {
        setDetectedChainId(chainId.toString());
        return false;
      }

      setIsDataValid(true);
      return true;
    } catch (e) {
      setValidationErrors((prev) => ({
        ...prev,
        rpcUrl: "Invalid RPC URL. Unable to connect.",
      }));
      setIsDataValid(false);
      return false;
    }
  };

  const handleSave = async () => {
    const formValidation = await validateForm();
    const rpcValidation = await validateRpcUrl(networkDetails.rpcUrls[0]);

    if (formValidation && rpcValidation) {
      const formattedData: ChainData = {
        ...networkDetails,
        name: networkDetails.displayName.toLowerCase(),
        nativeCurrency: {
          ...networkDetails.nativeCurrency,
          symbol: networkDetails.nativeCurrency.symbol.toUpperCase(),
        },
        chainId: parseInt(networkDetails.chainId, 10),
      };
      addNewChain(formattedData);
      onClose();
    }
  };

  const formFields = [
    {
      label: "Network Name",
      field: "displayName" as const,
      placeholder: "Enter network name",
      keyboardType: "default" as const,
      value: networkDetails.displayName,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.dismissArea} onPress={onClose} />
        <View style={styles.editContainer}>
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
            contentContainerStyle={styles.scrollViewContent}
          >
            {formFields.map((field, index) => (
              <View key={field.field} style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    currentInputIndex === index && styles.focusedInput,
                    validationErrors[field.field] && styles.errorInput,
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#666"
                  keyboardType={field.keyboardType}
                  value={field.value}
                  onChangeText={(text) => handleInputChange(field.field, text)}
                  onFocus={() => setCurrentInputIndex(index)}
                  onBlur={() => setCurrentInputIndex(-1)}
                />
                {validationErrors[field.field] && (
                  <Text style={styles.errorText}>
                    {validationErrors[field.field]}
                  </Text>
                )}
                {field.field === "rpcUrl" && detectedChainId && (
                  <Text style={styles.suggestedChainText}>
                    RPC suggests Chain ID: {detectedChainId}
                  </Text>
                )}
              </View>
            ))}
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
                (!isDataValid || Object.keys(validationErrors).length > 0) &&
                  styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={
                !isDataValid || Object.keys(validationErrors).length > 0
              }
            >
              <Text style={styles.actionButtonText}>Add Network</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
  },
  scrollViewContent: {
    paddingBottom: 20,
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
  suggestedChainText: {
    color: "#FFA500", // Orange color to stand out
    fontSize: 12,
    marginTop: 4,
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
  errorInput: {
    borderColor: "#ff4444",
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
