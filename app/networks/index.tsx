import NetworkSection from "@/components/networks";
import AddNetworkButton from "@/components/networks/add/button/AddNetwork";
import EditNetworkModal from "@/components/networks/edit/EditNetwork";
import NetworkOptionsModal from "@/components/networks/options";
import { useChainsStore } from "@/store/chains";
import { ChainData } from "@/types/network";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

export const ChainsNetworksView = () => {
  const { chains } = useChainsStore();
  const [selectedChain, setSelectedChain] = useState<ChainData | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Separate mainnet and testnet chains
  const mainnetChains = Object.values(chains).filter((chain) => chain.mainnet);
  const testnetChains = Object.values(chains).filter((chain) => !chain.mainnet);

  const selectChain = (chain: ChainData) => {
    setSelectedChain(chain);
    setShowOptions(true);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Networks</Text>
      </View>
      <ScrollView style={styles.container}>
        <NetworkSection
          selectChain={selectChain}
          title="Mainnet"
          chains={mainnetChains}
        />
        <NetworkSection
          selectChain={selectChain}
          title="Testnet"
          chains={testnetChains}
        />
      </ScrollView>
      <AddNetworkButton onPress={() => {}} />
      {selectedChain && (
        <NetworkOptionsModal
          selectedChain={selectedChain}
          closeModal={() => setShowOptions(false)}
          showEditModal={() => setShowEditModal(true)}
          showOptions={showOptions}
        />
      )}
      {selectedChain && (
        <EditNetworkModal
          closeModal={() => setShowEditModal(false)}
          closeOptionsModal={() => setShowOptions(false)}
          selectedChain={selectedChain}
          showEditModal={showEditModal}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default ChainsNetworksView;
