// components/RequestInputContainer.tsx
import { Networks } from "@/enums/network/ecosystem";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import InfoSection from "./RequestInfoSection";

interface RequestInputContainerProps {
  requesterAddress: string;
  setRequesterAddress: (address: string) => void;
  error: string;
  setError: (error: string) => void;
}

type ValidationResult = {
  isValid: boolean;
  type?: "twitter" | "address";
  exists?: boolean;
};

const RequestInputContainer = ({
  requesterAddress,
  setRequesterAddress,
  error,
  setError,
}: RequestInputContainerProps) => {
  const [infoType, setInfoType] = useState<
    "initial" | "twitter-not-found" | "address-not-found"
  >("initial");
  const [isValidating, setIsValidating] = useState(false);

  const validateInput = async (input: string): Promise<ValidationResult> => {
    // Check if it's a Twitter handle
    if (input.startsWith("@") || !input.includes(".")) {
      const handle = input.startsWith("@") ? input.substring(1) : input;
      // Mock API call to check if Twitter user exists in your app
      // Replace with actual API call
      const exists = await checkTwitterUser(handle);
      return { isValid: true, type: "twitter", exists };
    }

    // Validate as blockchain address
    // Replace with actual blockchain address validation
    const isValidAddress = true; // Add your address validation logic
    if (isValidAddress) {
      // Mock API call to check if address exists in your app
      const exists = await checkAddressExists(input);
      return { isValid: true, type: "address", exists };
    }

    return { isValid: false };
  };

  // Mock API functions - replace with actual implementations
  const checkTwitterUser = async (handle: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(false), 500));
  };

  const checkAddressExists = async (address: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(false), 500));
  };

  useEffect(() => {
    const validate = async () => {
      if (!requesterAddress.trim()) {
        setInfoType("initial");
        return;
      }
      let isValidInput = false;
      const isInputTwitterHandle = requesterAddress.startsWith("@");
      if (isInputTwitterHandle) {
        const twitterAccFound = false;
        isValidInput = twitterAccFound;
      } else {
        const { isAddressValid, network } = {
          isAddressValid: false,
          network: Networks.EVM,
        };
        isValidInput = isAddressValid;
      }
      if (isValidInput) {
        setIsValidating(true);
        const result = await validateInput(requesterAddress);
        setIsValidating(false);

        if (!result.isValid) {
          setError("Please enter a valid Twitter handle or blockchain address");
          setInfoType("initial");
          return;
        }

        setError("");
        if (result.type === "twitter" && !result.exists) {
          setInfoType("twitter-not-found");
        } else if (result.type === "address" && !result.exists) {
          setInfoType("address-not-found");
          setInfoType("address-not-found");
        } else {
          setInfoType("initial");
        }
      } else {
        if (isInputTwitterHandle) {
          setInfoType("twitter-not-found");
        } else {
          setInfoType("address-not-found");
        }
      }
    };

    const debounce = setTimeout(validate, 500);
    return () => clearTimeout(debounce);
  }, [requesterAddress]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Request From</Text>
      <TextInput
        style={styles.requesterInput}
        placeholder="Enter Twitter handle or address"
        placeholderTextColor="#666"
        value={requesterAddress}
        onChangeText={(text) => {
          setRequesterAddress(text);
          setError("");
        }}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <InfoSection
          type={infoType}
          twitterHandle={
            requesterAddress.startsWith("@")
              ? requesterAddress.substring(1)
              : requesterAddress
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2C2C2C",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 12,
  },
  requesterInput: {
    backgroundColor: "#2C2C2C",
    color: "white",
    fontSize: 16,
    padding: 4,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
});

export default RequestInputContainer;
