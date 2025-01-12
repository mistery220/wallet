import { ChainData } from "@/types/network";
import { StyleSheet, Text, View } from "react-native";
import ChainCard from "./chains/ChainCard";

const NetworkSection = ({
  title,
  chains,
  selectChain,
}: {
  title: string;
  chains: ChainData[];
  selectChain: (chain: ChainData) => void;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
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
