import { useTabsStore } from "@/store/browser/tabs";
import { TabData } from "@/types/browser/tabs";
import { Currency } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const TabScreen = ({ showTabsScreen }: { showTabsScreen: () => void }) => {
  const { tabsData, currTab, setCurrTab } = useTabsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState<string>(currTab?.url || "");
  const webViewRef = useRef(null);

  console.log({ currTab });

  const handleUrlSubmit = () => {
    const currentTab = currTab as TabData;
    const currUrl = inputUrl.trim();
    let formattedUrl = currUrl.trim();
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl =
        "https://www.google.com/search?q=" + encodeURIComponent(formattedUrl);
    }
    currentTab.url = formattedUrl;
    setCurrTab(currentTab);
    // Hide keyboard after submission
    Keyboard.dismiss();
  };

  const handleLoadStart = (e: any) => {
    if (currTab) {
      setCurrTab({ ...currTab, title: e.nativeEvent.title });
      setIsLoading(true);
    }
  };

  const handleLoadEnd = (event: any) => {
    setIsLoading(false);
    console.log({ event });
    // Update tab title and URL based on loaded page
    // if (event.nativeEvent.title) {
    //   const updatedTab = {
    //     ...currentTab,
    //     title: event.nativeEvent.title,
    //     url: event.nativeEvent.url,
    //   };
    //   setCurrentTab(updatedTab);
    //   // setCurrentUrl(event.nativeEvent.url);
    // }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressBarContainer}>
        <TextInput
          style={styles.addressBar}
          value={inputUrl}
          onChangeText={(s) => {
            setInputUrl(s);
          }}
          onSubmitEditing={handleUrlSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          placeholder="Enter URL"
          placeholderTextColor="#999"
          selectTextOnFocus
        />
        <TouchableOpacity style={styles.navButton} onPress={showTabsScreen}>
          <Text style={styles.navButtonText}>
            {Object.values(tabsData).length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* WebView */}
      {currTab?.url && (
        <WebView
          ref={webViewRef}
          source={{ uri: currTab.url }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066ff" />
            </View>
          )}
        />
      )}

      {/* Loading Indicator overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066ff" />
        </View>
      )}
    </View>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addressBar: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 16,
    color: "#333",
  },
  goButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#007bff",
    borderRadius: 20,
  },
  goButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 18,
    color: "#333",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tabCounter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  siteDetails: {
    padding: 10,
    backgroundColor: "#222",
  },
  siteTitle: {
    color: "#fff",
    fontSize: 20,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
