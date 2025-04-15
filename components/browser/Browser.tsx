import Constants from "expo-constants";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [result, setResult] = useState<any>(null);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "https://reactnative.dev/" }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
  },
});
