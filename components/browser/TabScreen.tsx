import { INJECTED_ETH_SCRIPT } from "@/constants/scripts/evm";
import useInjectedScriptHandler from "@/hooks/browser/useInjectedScriptHandler";
import { useTabsStore } from "@/store/browser/tabs";
import { TabData } from "@/types/browser/tabs";
import { getFormattedUrl } from "@/utils/browser/url";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

const TabScreen = ({
  showTabsScreen,
  currTab,
}: {
  showTabsScreen: () => void;
  currTab: TabData;
}) => {
  const { webViewRef, handleWebViewMessage } = useInjectedScriptHandler();
  const tabsData = useTabsStore((state) => state.tabsData);
  const setCurrTab = useTabsStore((state) => state.setCurrTab);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    webViewRef.current?.reload();
  };
  const [inputUrl, setInputUrl] = useState<string>(currTab?.url || "");

  const handleUrlSubmit = () => {
    const currentTab = currTab;
    const formattedUrl = getFormattedUrl(inputUrl);
    currentTab.url = formattedUrl;
    setCurrTab(currentTab);
    // Hide keyboard after submission
    Keyboard.dismiss();
    setRefreshing(true);
  };

  const handleLoadStart = (e: any) => {
    setCurrTab({ ...currTab, title: e.nativeEvent.title });
  };

  const handleLoadEnd = (event: any) => {
    setCurrTab({
      ...currTab,
      url: event.nativeEvent.url,
    });
    setInputUrl(event.nativeEvent.url);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressBarContainer}>
        <TouchableOpacity style={styles.avatar}>
          <Text style={{ color: "#fff" }}>A1</Text>
        </TouchableOpacity>
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
          placeholder="Enter URL or search"
          placeholderTextColor="#999"
          selectTextOnFocus
        />
        <TouchableOpacity style={styles.navButton} onPress={showTabsScreen}>
          <View style={styles.tabCounter}>
            <Text style={styles.tabCounterText}>
              {Object.values(tabsData).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: currTab.url }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        originWhitelist={["*"]}
        injectedJavaScript={INJECTED_ETH_SCRIPT}
        onMessage={handleWebViewMessage}
        pullToRefreshEnabled={true}
        forceDarkOn={true}
        overScrollMode="always"
      />
    </View>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  addressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  avatar: {
    backgroundColor: "#333",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addressBar: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    fontSize: 16,
    color: "#fff",
  },
  navButton: {
    padding: 4,
  },
  tabCounter: {
    backgroundColor: "#1E1E1E",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tabCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(18, 18, 18, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  emptyStateText: {
    color: "#9a9a9a",
    fontSize: 16,
    marginTop: 16,
  },
});
