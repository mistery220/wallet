import CustomImg from "@/components/image/CustomImg";
import { useChainsStore } from "@/store/chains";
import { useCurrentStore } from "@/store/current";
import { ChainData } from "@/types/network";
import { getEllipsisText } from "@/utils/string/ellipsis";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
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

const NetworkItem = ({ chain }: { chain: ChainData }) => {
  const { activeId, accounts } = useCurrentStore();
  const active = accounts[activeId];
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(active.address[chain.type]);
  };

  return (
    <>
      <TouchableOpacity style={styles.networkItem}>
        <View style={styles.networkInfo}>
          <CustomImg uri={chain.logo} style={styles.networkIcon} />
          <View style={styles.networkText}>
            <Text style={styles.networkName}>{chain.name}</Text>
            <Text
              style={styles.networkAddress}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {getEllipsisText(active.address[chain.type])}
            </Text>
          </View>
        </View>
        <View style={styles.networkActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowQR(true)}
          >
            <Ionicons name="qr-code" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <QRModal
        visible={showQR}
        onClose={() => setShowQR(false)}
        address={active.address[chain.type]}
        chainName={chain.name}
      />
    </>
  );
};

const ReceiveScreen: React.FC = () => {
  const { chains } = useChainsStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.networksList}>
          {Object.values(chains).map((chain) => (
            <NetworkItem key={chain.type} chain={chain} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 16,
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
    flex: 1,
  },
  networkName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
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
});

export default ReceiveScreen;
