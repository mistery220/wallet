import { useTabsStore } from "@/store/browser/tabs";
import { getFormattedUrl } from "@/utils/browser/url";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const tokens = [
  {
    name: "Furfication",
    symbol: "Fur",
    price: "$0.0043712",
    change: "+119,927.90%",
    icon: "https://dummyimage.com/40x40/6f6/fafafa",
    rank: 1,
  },
  {
    name: "most valuable...",
    symbol: "time",
    price: "$0.00055792",
    change: "+11,863.29%",
    icon: "https://dummyimage.com/40x40/000/fff",
    rank: 2,
  },
  {
    name: "@grok draw me",
    symbol: "drawify",
    price: "$0.00051613",
    change: "+12,017.50%",
    icon: "https://dummyimage.com/40x40/cc0000/ffffff",
    rank: 3,
  },
];

const BrowserLanding = ({ showTabsScreen }: { showTabsScreen: () => void }) => {
  const { addNewTabAsCurr } = useTabsStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  function addNewPageAndOpenIt() {
    const formattedUrl = getFormattedUrl(searchQuery);
    addNewTabAsCurr(formattedUrl);
    Keyboard.dismiss();
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatar}>
            <Text style={{ color: "#fff" }}>A1</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Sites, tokens, URL"
            placeholderTextColor="#999"
            style={styles.searchBar}
            value={searchQuery}
            onChangeText={(input) => {
              setSearchQuery(input);
            }}
            selectTextOnFocus
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={addNewPageAndOpenIt}
          />
          <TouchableOpacity onPress={showTabsScreen}>
            <Ionicons name="copy-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <View style={styles.categories}>
          {["Tokens", "People", "Sites", "NFTs"].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.pill}>
              <Text style={styles.pillText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Ad */}
        <View style={styles.banner}>
          <Image
            source={{ uri: "https://dummyimage.com/40x40/f60/fff&text=HM" }}
            style={styles.bannerIcon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Helium Mobile</Text>
            <Text style={styles.bannerSubtitle}>
              A phone plan that rewards you and your community for using it
            </Text>
          </View>
          <TouchableOpacity style={styles.visitButton}>
            <Text style={{ color: "#000", fontWeight: "600" }}>Visit</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Tokens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Tokens</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>

        {tokens.map((token, index) => (
          <View key={index} style={styles.tokenCard}>
            <Image source={{ uri: token.icon }} style={styles.tokenIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tokenName}>{token.name}</Text>
              <Text style={styles.tokenSymbol}>{token.symbol}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.tokenPrice}>{token.price}</Text>
              <Text style={styles.tokenChange}>{token.change}</Text>
            </View>
          </View>
        ))}

        {/* People to Follow */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People to Follow</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        </View>

        {/* Add mock people */}
        {["@joiceloo", "@bangerz"].map((name, idx) => (
          <View key={idx} style={styles.personCard}>
            <Image
              source={{ uri: "https://dummyimage.com/40x40/ff6347/fff" }}
              style={styles.tokenIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.tokenName}>{name}</Text>
              <Text style={styles.tokenSymbol}>
                {idx === 0 ? "3.1K followers" : "2.0K followers"}
              </Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Follow</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BrowserLanding;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  avatar: {
    backgroundColor: "#333",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    color: "#fff",
  },
  categories: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  pill: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pillText: {
    color: "#fff",
    fontWeight: "500",
  },
  banner: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  bannerTitle: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  visitButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  seeMore: {
    color: "#9a9a9a",
    fontSize: 12,
  },
  tokenCard: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  tokenName: {
    color: "#fff",
    fontWeight: "600",
  },
  tokenSymbol: {
    color: "#aaa",
    fontSize: 12,
  },
  tokenPrice: {
    color: "#fff",
    fontWeight: "600",
  },
  tokenChange: {
    color: "#1DEB6E",
    fontSize: 12,
  },
  personCard: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "#7B61FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
