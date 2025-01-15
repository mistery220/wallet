import ChainSelector from "@/components/networks/chains/ChainSelector";
import { DEFAULT_CHAINID } from "@/constants/netowrks/chain";
import { useFormStore } from "@/store/form";
import { useUserTokensStore } from "@/store/user/tokens";
import { Token } from "@/types/token";
import { joinStrings } from "@/utils/string/join";
import { AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function FromTokenSelection() {
  const { fromChainId } = useLocalSearchParams();
  const [selectedChainId, setSelectedChainId] = useState<number>(
    Number(fromChainId || DEFAULT_CHAINID)
  );
  const { setFromTokens } = useFormStore();
  const router = useRouter();
  const { tokens } = useUserTokensStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const tokensList = useMemo(() => {
    return Object.values(tokens[selectedChainId]).sort((a, b) => {
      const balA = parseFloat(a.bal) || 0;
      const balB = parseFloat(b.bal) || 0;
      return balB - balA;
    });
  }, [tokens, selectedChainId]);

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

  const handleSelectToken = (token: Token) => {
    const formKey = joinStrings(token.chainId, token.address);
    setFromTokens({ [formKey]: token });
    router.back();
  };

  const renderToken = ({ item }: { item: Token }) => {
    const formattedBalance = parseFloat(item.bal).toFixed(4);

    return (
      <Pressable
        style={styles.tokenItem}
        onPress={() => handleSelectToken(item)}
      >
        <View style={styles.tokenContent}>
          <View style={styles.tokenInfo}>
            <Image source={{ uri: item.logo }} style={styles.tokenLogo} />
            <View style={styles.tokenDetails}>
              <Text style={styles.tokenSymbol}>{item.symbol}</Text>
              <Text style={styles.tokenName}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>{formattedBalance}</Text>
            <Text style={styles.networkText}>{item.network}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

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
        renderItem={renderToken}
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
  tokenItem: {
    margin: 8,
    marginBottom: 0,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tokenContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#3A3A3A",
  },
  tokenDetails: {
    justifyContent: "center",
  },
  tokenSymbol: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  tokenName: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  networkText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
