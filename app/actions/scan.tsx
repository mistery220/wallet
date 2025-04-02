import WalletKitClient from "@/clients/walletKit/WalletKit";
import { onSessionProposal } from "@/utils/wallet-kit/session";
import { WalletKit } from "@reown/walletkit";
import { Core } from "@walletconnect/core";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleBarCodeScanned = async ({
    type,
    data,
  }: BarcodeScanningResult) => {
    if (scanned) return;

    setScanned(true);
    setScanData(data);
    try {
      const core = new Core({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID!,
      });

      const walletKit = await WalletKit.init({
        core,
        metadata: {
          name: "My Expo Wallet",
          description: "Wallet built with Expo and WalletConnect",
          url: "https://mywallet.app",
          icons: ["https://mywallet.app/icon.png"],
          redirect: {
            native: "wallet://",
          },
        },
      });

      walletKit.on("session_proposal", (proposal) =>
        onSessionProposal({ proposal, walletKit })
      );
      const res = await walletKit.pair({ uri: data });
    } catch (e) {
      console.log({ e });
    }
    Alert.alert("QR Code Scanned", `Data: ${data}`, [
      {
        text: "Scan Again",
        onPress: () => setScanned(false),
        style: "cancel",
      },
      { text: "OK" },
    ]);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {!scanned ? (
            <Text style={styles.scanText}>Position QR code in the center</Text>
          ) : (
            <Text style={styles.scanText}>QR Detected: {scanData}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>

            {scanned && (
              <TouchableOpacity
                style={[styles.button, styles.scanButton]}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.text}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    padding: 20,
  },
  scanText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "rgba(0,100,0,0.6)",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
