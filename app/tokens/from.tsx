import { Networks } from "@/enums/network/ecosystem";
import { useUserTokensStore } from "@/store/user/tokens";
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

type TokenListItem = {
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  network: Networks;
  address: string;
  logo: string;
  bal: string;
};

export default function TokenSelectionScreen() {
  const router = useRouter();
  const { tokens } = useUserTokensStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Convert tokens object to array and sort by balance
  const tokensList = useMemo(() => {
    return Object.values(tokens).sort((a, b) => {
      const balA = parseFloat(a.bal) || 0;
      const balB = parseFloat(b.bal) || 0;
      return balB - balA;
    });
  }, [tokens]);

  // Filter tokens based on search query
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

  const handleSelectToken = (token: TokenListItem) => {
    // Navigate back with selected token
    router.back();
    // You might want to use a callback or store to handle the selected token
  };

  const renderToken = ({ item }: { item: TokenListItem }) => {
    const formattedBalance = parseFloat(item.bal).toFixed(4);

    return (
      <Pressable
        style={styles.tokenItem}
        onPress={() => handleSelectToken(item)}
      >
        <View style={styles.tokenInfo}>
          <Image
            source={{ uri: item.logo }}
            style={styles.tokenLogo}
            // defaultSource={require("../assets/default-token.png")}
          />
          <View style={styles.tokenDetails}>
            <Text style={styles.tokenSymbol}>{item.symbol}</Text>
            <Text style={styles.tokenName}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>{formattedBalance}</Text>
          <Text style={styles.networkText}>{item.network}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
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
        estimatedItemSize={72}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 0,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchWrapperFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#3a3a3a",
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
  tokenItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tokenDetails: {
    justifyContent: "center",
  },
  tokenSymbol: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  tokenName: {
    color: "#999",
    fontSize: 14,
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  networkText: {
    color: "#999",
    fontSize: 12,
    marginTop: 2,
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
