import WalletKitClient from "@/clients/walletKit/WalletKit";
import Camera from "@/components/scanner/Camera";
import { isAddressValidForAnyNetwork } from "@/utils/tokens/address";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchOn, setTorchOn] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: any) => {
    if (scanned) return;
    setScanned(true);

    if (data?.startsWith("wc")) {
      try {
        WalletKitClient.sessionProposal();
        await WalletKitClient.walletKit.pair({ uri: data });
      } catch (e) {
        console.log({ e });
      }
    } else if (isAddressValidForAnyNetwork(data)) {
      // Handle address logic here
    }
  };

  const toggleTorch = () => setTorchOn((prev) => !prev);

  return (
    <View style={styles.container}>
      <Camera
        scanned={scanned}
        facing={facing}
        torchOn={torchOn}
        handleBarCodeScanned={handleBarCodeScanned}
        toggleTorch={toggleTorch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
});
