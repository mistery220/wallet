import CustomImg from "@/components/image/CustomImg";
import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import { AntDesign } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
    <CustomImg uri={uri} style={styles.chainLogo} />
  );

  const renderChainItem = ({ item: chain }: { item: ChainData }) => (
    <View style={styles.chainItemWrapper}>
      <Pressable
        style={[
          styles.chainItem,
          selectedChainId === chain.chainId && styles.chainItemSelected,
        ]}
        onPress={() => handleChainSelect(chain.chainId)}
      >
        <View style={styles.chainItemContent}>
          {renderChainLogo(chain.logo)}
          <Text style={styles.chainItemText}>{chain.displayName}</Text>
        </View>
        {selectedChainId === chain.chainId && (
          <AntDesign name="check" size={20} color="#007AFF" />
        )}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.chainSelectorSection}>
      <Pressable
        style={styles.chainSelector}
        onPress={() => setIsModalVisible(true)}
      >
        <View style={styles.selectedChainInfo}>
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
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Network</Text>
                  <Pressable
                    hitSlop={12}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <AntDesign name="close" size={24} color="#999" />
                  </Pressable>
                </View>

                <View style={styles.searchContainer}>
                  <View
                    style={[
                      styles.searchWrapper,
                      isSearchFocused && styles.searchWrapperFocused,
                    ]}
                  >
                    <AntDesign
                      name="search1"
                      size={20}
                      color="#999"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search networks"
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                    {searchQuery ? (
                      <Pressable
                        style={styles.clearButton}
                        hitSlop={12}
                        onPress={() => setSearchQuery("")}
                      >
                        <AntDesign name="close" size={20} color="#999" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>

                <FlatList
                  data={filteredChains}
                  renderItem={renderChainItem}
                  keyExtractor={(item) => item.chainId.toString()}
                  showsVerticalScrollIndicator={true}
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
  chainSelectorSection: {
    margin: 2,
  },
  chainSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#2A2A2A",
    margin: 8,
    marginBottom: 0,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedChainInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedChainName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  chainLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
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
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchWrapperFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#3A3A3A",
  },
  searchIcon: {
    padding: 12,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    padding: 12,
    paddingLeft: 0,
  },
  clearButton: {
    padding: 12,
  },
  chainList: {
    padding: 8,
    paddingBottom: 34,
  },
  chainItemWrapper: {
    marginBottom: 8,
  },
  chainItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  chainItemText: {
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
