import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AddNetworkButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Add Network</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddNetworkButton;
