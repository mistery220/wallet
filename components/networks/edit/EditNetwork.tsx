import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import { MaterialIcons } from "@expo/vector-icons";
import { JsonRpcProvider } from "ethers";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EditableField = {
  label: string;
  key: string;
  value: string;
  multiline?: boolean;
};

export default function EditNetworkModal({
  selectedChain,
  showEditModal,
  closeModal,
  closeOptionsModal,
}: {
  selectedChain: ChainData;
  showEditModal: boolean;
  closeModal: () => void;
  closeOptionsModal: () => void;
}) {
  const { updateChain } = useChainsStore();

  const [editedValues, setEditedValues] = useState<Partial<ChainData>>({});
  const [isDataValid, setIsDataValid] = useState<boolean>(true);

  const handleEditField = (field: string, value: string) => {
    setIsDataValid(true);
    setEditedValues((prev) => {
      if (field === "rpcUrls") {
        return {
          ...prev,
          [field]: [value],
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const validateRpcUrl = async () => {
    if (!editedValues.rpcUrls?.[0]) {
      return false;
    }

    try {
      const provider = new JsonRpcProvider(editedValues.rpcUrls[0], undefined, {
        staticNetwork: true,
      });
      const chainDetails = await provider.getNetwork();
      if (Number(chainDetails.chainId.toString()) === selectedChain.chainId) {
        return true;
      }
      return false;
    } catch (e) {
      console.log("RPC validation error:", e);
      return false;
    }
  };

  const handleSaveChanges = async () => {
    const isValid = await validateRpcUrl();
    setIsDataValid(isValid);
    if (!isValid) return;
    const updatedValues = {
      ...selectedChain,
      ...editedValues,
    };
    updateChain(updatedValues);
    closeModal();
    closeOptionsModal();
    setEditedValues({});
  };

  const editableFields: EditableField[] = [
    {
      label: "Display Name",
      key: "displayName",
      value: selectedChain.displayName,
    },
    {
      label: "RPC URLs",
      key: "rpcUrls",
      value: selectedChain.rpcUrls.join("\n"),
      multiline: true,
    },
    {
      label: "Block Explorer URL",
      key: "blockExplorerUrl",
      value: selectedChain.blockExplorerUrl,
    },
  ];

  return (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeModal}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.editContainer}>
            <View style={styles.optionsHeader}>
              <Text style={styles.optionsTitle}>Edit Network</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editFields}>
              {editableFields.map((field) => (
                <View key={field.key} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      field.multiline && styles.multilineInput,
                    ]}
                    value={
                      editedValues[field.key as keyof ChainData]?.toString() ||
                      field.value
                    }
                    onChangeText={(value) => handleEditField(field.key, value)}
                    placeholder={field.label}
                    placeholderTextColor="#666"
                    multiline={field.multiline}
                  />
                </View>
              ))}
            </ScrollView>
            {!isDataValid && (
              <Text style={styles.errorText}>Invalid RPC URL</Text>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.actionButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  editContainer: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
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
    marginBottom: 20,
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
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
});
