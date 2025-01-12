import { ChainData } from "@/types/network";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ChainCard = ({
  chain,
  selectChain,
}: {
  chain: ChainData;
  selectChain: () => void;
}) => (
  <TouchableOpacity
    key={chain.chainId}
    style={styles.chainCard}
    onPress={selectChain}
  >
    <View style={styles.chainHeader}>
      <View style={styles.leftSection}>
        <Image source={{ uri: chain.logo }} style={styles.chainLogo} />
        <View style={styles.chainInfo}>
          <Text style={styles.chainName}>{chain.displayName}</Text>
          <View style={styles.typeContainer}>
            <View style={styles.badge}>
              <Text style={styles.chainType}>{chain.type}</Text>
            </View>
          </View>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </View>

    <View style={styles.currencyInfo}>
      <View style={styles.currencyBadge}>
        <Text style={styles.currencyText}>{chain.nativeCurrency.symbol}</Text>
      </View>
      <Text style={styles.currencyName}>{chain.nativeCurrency.name}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chainCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  chainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chainLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333",
  },
  chainInfo: {
    marginLeft: 12,
    flex: 1,
  },
  chainName: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chainType: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  currencyInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  currencyBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  currencyName: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});

export default ChainCard;
