import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  StyleSheet,
} from "react-native";

import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");
const QR_SIZE = width * 0.6;

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  address: string;
  chainName: string;
}

const QRModal = ({ visible, onClose, address, chainName }: QRModalProps) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{chainName} Address</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
              <QRCode
                value={address}
                size={QR_SIZE}
                backgroundColor="#fff"
                color="#000"
              />
            </View>

            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    alignItems: "center",
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
  },
  addressText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textTransform: "capitalize",
  },
});
export default QRModal;
