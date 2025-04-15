import Constants from "expo-constants";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Browser() {
  const [result, setResult] = useState<any>(null);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://reactnative.dev/" }}
        style={styles.webview} // Apply the correct styles here
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes up the entire screen
    backgroundColor: "#ecf0f1",
    paddingTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});
