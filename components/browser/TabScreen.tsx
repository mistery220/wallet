import { INJECTED_ETH_SCRIPT } from "@/constants/scripts/evm";
import useInjectedScriptHandler from "@/hooks/browser/useInjectedScriptHandler";
import { useTabsStore } from "@/store/browser/tabs";
import { useCurrentStore } from "@/store/current";
import { TabData } from "@/types/browser/tabs";
import { getFormattedUrl } from "@/utils/browser/url";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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
  const { accounts, activeId } = useCurrentStore();
  const setCurrTab = useTabsStore((state) => state.setCurrTab);
  const [refreshing, setRefreshing] = useState(false);
  const [inputUrl, setInputUrl] = useState<string>(currTab?.url || "");

  const onRefresh = () => {
    setRefreshing(true);
    webViewRef.current?.reload();
  };

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
    setRefreshing(true);
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
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => {
            router.push("/(app)/accounts/addresses");
          }}
        >
          <Text style={{ color: "#fff" }}>{accounts[activeId].name[0]}</Text>
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
        <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={showTabsScreen}>
          <View style={styles.tabCounter}>
            <Text style={styles.tabCounterText}>
              {Object.values(tabsData).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.webview}>
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
          // renderLoading={() => (
          //   <View style={styles.loadingContainer}>
          //     <ActivityIndicator size="large" color="#7B61FF" />
          //   </View>
          // )}
        />
      </View>
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
  iconButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
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
