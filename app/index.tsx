import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.header}>
      <Link href={"/onboard"} style={styles.titleContainer}>Home</Link>
    </View>
  );
};

export default Home;

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
