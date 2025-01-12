import { ChainData } from "@/types/network";
import { StyleSheet, View } from "react-native";
import ChainCard from "./chains/ChainCard";

const NetworkSection = ({
  chains,
  selectChain,
}: {
  chains: ChainData[];
  selectChain: (chain: ChainData) => void;
}) => (
  <View style={styles.section}>
    {chains.map((chain) => (
      <ChainCard
        selectChain={() => {
          selectChain(chain);
        }}
        key={chain.chainId}
        chain={chain}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default NetworkSection;
