import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.header}>
      <Text style={styles.titleContainer}>Hey, its working</Text>
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
