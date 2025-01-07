import EncryptedStorage from "@/encryption/EncryptedStore";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [key, setKey] = useState<string>();
  return (
    <View style={styles.header}>
      <Text style={styles.titleContainer}>Hey, its working</Text>
      <Button
        title="Submit"
        onPress={async () => {
          try {
            const encryptedStorage = new EncryptedStorage();
            await encryptedStorage.savePrivateKey(
              "1",
              "1234"
            );
            console.log("Successfully saved!");
          } catch (e) {
            console.dir({ e });
          }
        }}
      />
      <Button
        title="Retrieve"
        onPress={async () => {
          try {
            const encryptedStorage = new EncryptedStorage();
            const res = await encryptedStorage.retrievePrivateKey("1234");
            if (res) {
              setKey(res);
            }
            console.log("Successfully retrieved!");
          } catch (e) {
            console.dir({ e });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34", // Optional: Add a background color for better visibility
  },
  titleContainer: {
    fontSize: 20,
    color: "white",
  },
});
