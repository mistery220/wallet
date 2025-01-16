import ChainSelector from "@/components/networks/chains/ChainSelector";
import TokenListItem from "@/components/token/TokenListItem";
import { DEFAULT_CHAINID } from "@/constants/network/chain";
import { useFormStore } from "@/store/form";
import { useTokensStore } from "@/store/tokens";
import { useUserTokensStore } from "@/store/user/tokens";
import { Token } from "@/types/token";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ToTokenSelection() {
  const { setToToken } = useFormStore();
  const router = useRouter();
  const { fromChainId } = useLocalSearchParams();
  const [selectedChainId, setSelectedChainId] = useState<number>(
    Number(fromChainId || DEFAULT_CHAINID)
  );
  const { tokens } = useTokensStore();
  const { tokens: userTokens } = useUserTokensStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSelectToken = (token: Token) => {
    setToToken(token);
    router.back();
  };

  const tokensList = useMemo(() => {
    const updatedTokens = {
      ...tokens[selectedChainId],
      ...userTokens[selectedChainId],
    };
    return Object.values(updatedTokens).sort((a, b) => {
      const balA = parseFloat(a.bal) || 0;
      const balB = parseFloat(b.bal) || 0;
      return balB - balA;
    });
  }, [tokens, selectedChainId, userTokens]);

  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tokensList;

    return tokensList.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    );
  }, [tokensList, searchQuery]);

  return (
    <View style={styles.container}>
      <ChainSelector
        onChainSelect={(chainId) => {
          setSelectedChainId(chainId);
        }}
        selectedChainId={selectedChainId}
      />
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchWrapper,
            isFocused && styles.searchWrapperFocused,
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
            placeholder="Search tokens"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery ? (
            <Pressable
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <AntDesign name="close" size={20} color="#999" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlashList
        data={filteredTokens}
        renderItem={({ item }) => (
          <TokenListItem handleSelectToken={handleSelectToken} item={item} />
        )}
        estimatedItemSize={88}
        keyExtractor={(item) => `${item.address}-${item.network}`}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tokens found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  chainSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#2A2A2A",
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
    width: 24,
    height: 24,
    borderRadius: 12,
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
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
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalSearchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  chainModalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  chainModalItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chainModalItemText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});
