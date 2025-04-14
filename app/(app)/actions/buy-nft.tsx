import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Store and Hook Imports
import { useFormStore } from "@/store/form";
import { useChainsStore } from "@/store/chains";
// import useBuildNFTPurchaseTxn from "@/hooks/nft/useBuildNFTPurchaseTxn";
// import useSendNFTTransaction from "@/hooks/nft/useSendNFTTransaction";

// Component Imports
import TokenSelection from "@/components/token/TokenSelection";
import FromContainerSwap from "@/components/token/swap/FromContainer";
import ToContainerSwap from "@/components/token/swap/ToContainer";
import { useTokensStore } from "@/store/tokens";

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tokenAmount: string;
  contractAddress: string;
  chainId: number;
  tokenAddress: string;
}

export default function NFTBuyScreen() {
  const router = useRouter();
  const {
    from: fromToken,
    to: toToken,
    setFromToken,
    setToToken,
  } = useFormStore();
  const { chains } = useChainsStore();
  const { tokens } = useTokensStore();

  const [nft, setNFT] = useState<NFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const { buildNFTPurchaseTxn, nftPurchaseQuote } = useBuildNFTPurchaseTxn();
  // const { sendNFTPurchase } = useSendNFTTransaction();

  useEffect(() => {
    // Simulated NFT fetch - replace with actual NFT fetch logic
    async function fetchNFTDetails() {
      try {
        // TODO: Replace with actual NFT fetching logic
        const mockNFT: NFT = {
          id: "1",
          name: "Cool Monkey NFT",
          description:
            "A unique digital art piece from the Cool Monkey collection",
          imageUrl: "/api/placeholder/400/400", // Replace with actual image URL
          tokenAmount: "10000",
          contractAddress: "0x1234...",
          chainId: 1,
          tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        };

        setNFT(mockNFT);

        // Automatically set to token as NFT price
        setToToken({
          amount: mockNFT.tokenAmount,
          assets: tokens[mockNFT.chainId][mockNFT.tokenAddress],
        });

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load NFT details");
        setIsLoading(false);
      }
    }

    fetchNFTDetails();
  }, []);

  const handleBuyNFT = async () => {
    if (!nft || !fromToken || !toToken) return;

    try {
      // const txnQuote = await buildNFTPurchaseTxn({
      //   nftId: nft.id,
      //   contractAddress: nft.contractAddress,
      //   paymentToken: fromToken,
      // });
      // const txnHash = await sendNFTPurchase(txnQuote);
      // router.push(`/transaction?chainId=${nft.chainId}&hash=${txnHash}`);
    } catch (err) {
      setError("NFT purchase failed");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !nft) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Unable to load NFT"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* From Token Selection (Payment Token) */}
      <FromContainerSwap
        buildTxnData={
          () => {}
          // () =>
          // buildNFTPurchaseTxn({
          //   nftId: nft.id,
          //   contractAddress: nft.contractAddress,
          //   paymentToken: fromToken,
          // })
        }
        isQuoteLoading={false}
      />

      {/* NFT Details Section */}
      <View style={styles.nftContainer}>
        <Image
          source={{ uri: nft.imageUrl }}
          style={styles.nftImage}
          resizeMode="cover"
        />
        <View style={styles.nftDetails}>
          <Text style={styles.nftName}>{nft.name}</Text>
          <Text style={styles.nftDescription} numberOfLines={2}>
            {nft.description}
          </Text>
        </View>
      </View>

      {/* To Token (NFT Price) */}
      <ToContainerSwap
        title="NFT Price"
        isQuoteLoading={false}
        buildTxnData={() => {}}
      />

      {/* Buy Button */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.buyButton,
            (!fromToken || !toToken) && styles.disabledButton,
          ]}
          onPress={handleBuyNFT}
          disabled={!fromToken || !toToken}
        >
          <Text style={styles.buyButtonText}>Buy NFT</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
  },
  nftContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  nftImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  nftDetails: {
    flex: 1,
  },
  nftName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  nftDescription: {
    color: "#999",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  buyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#4a4a4a",
    opacity: 0.7,
  },
  buyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
