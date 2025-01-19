import { useCurrentStore } from "@/store/current";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditNameScreen = () => {
  const { accountId } = useLocalSearchParams();
  const accId = accountId as string;
  const { accounts, updateAccount } = useCurrentStore();
  const [name, setName] = useState(accounts[accId].name || "");

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!name) return;

    try {
      updateAccount({ ...accounts[accId], name });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update account name");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Name</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter account name"
            placeholderTextColor="#666"
            autoFocus
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  saveButton: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 4,
  },
  input: {
    color: "white",
    fontSize: 16,
    padding: 12,
  },
});

export default EditNameScreen;
