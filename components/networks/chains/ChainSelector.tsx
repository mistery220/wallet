import CustomImg from "@/components/image/CustomImg";
import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import { AntDesign } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7;

interface ChainSelectorProps {
  selectedChainId: number;
  onChainSelect: (chainId: number) => void;
}

export default function ChainSelector({
  selectedChainId,
  onChainSelect,
}: ChainSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { chains } = useChainsStore();
  const selectedChain = chains[selectedChainId];

  const filteredChains = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return Object.values(chains);

    return Object.values(chains).filter((chain) =>
      chain.displayName.toLowerCase().includes(query)
    );
  }, [chains, searchQuery]);

  const handleChainSelect = (chainId: number) => {
    onChainSelect(chainId);
    setIsModalVisible(false);
  };

  const renderChainLogo = (uri: string) => (
    <CustomImg uri={uri} style={styles.svgLogo} />
  );

  const renderChainItem = ({ item: chain }: { item: ChainData }) => (
    <Pressable
      style={[
        styles.chainItem,
        selectedChainId === chain.chainId && styles.chainItemSelected,
      ]}
      onPress={() => handleChainSelect(chain.chainId)}
    >
      <View style={styles.chainItemContent}>
        {renderChainLogo(chain.logo)}
        <Text style={styles.chainName}>{chain.displayName}</Text>
      </View>
      {selectedChainId === chain.chainId && (
        <AntDesign name="check" size={20} color="#007AFF" />
      )}
    </Pressable>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.modalHandle} />
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Network</Text>
        <Pressable hitSlop={12} onPress={() => setIsModalVisible(false)}>
          <AntDesign name="close" size={24} color="#999" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <AntDesign name="search1" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search networks"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable hitSlop={12} onPress={() => setSearchQuery("")}>
              <AntDesign name="close" size={20} color="#999" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </>
  );

  return (
    <View>
      <Pressable
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          {selectedChain && (
            <>
              {renderChainLogo(selectedChain.logo)}
              <Text style={styles.selectedChainName}>
                {selectedChain.displayName}
              </Text>
            </>
          )}
        </View>
        <AntDesign name="down" size={20} color="#999" />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={filteredChains}
                  renderItem={renderChainItem}
                  keyExtractor={(item) => item.chainId.toString()}
                  showsVerticalScrollIndicator={true}
                  ListHeaderComponent={ListHeaderComponent}
                  contentContainerStyle={styles.chainList}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No networks found</Text>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedChainName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  logoWrapper: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    padding: 4,
  },
  svgLogo: {
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: MODAL_HEIGHT,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#666",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    padding: 12,
    paddingLeft: 8,
  },
  chainList: {
    paddingHorizontal: 8,
    paddingBottom: 34,
  },
  chainItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
  },
  chainItemSelected: {
    backgroundColor: "#3A3A3A",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  chainItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chainName: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
