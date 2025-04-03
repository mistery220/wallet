import WalletKitClient from "@/clients/walletKit/WalletKit";
import Camera from "@/components/scanner/Camera";
import { isAddressValidForAnyNetwork } from "@/utils/tokens/address";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QRScanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [torchOn, setTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [areAccountsSelected, setAreAccountsSelected] = useState(false);

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
      router.push(`/accounts/selection?wcUri=${data}`);
    } else if (isAddressValidForAnyNetwork(data)) {
      // Handle address logic here
    }
  };

  const toggleTorch = () => setTorchOn((prev) => !prev);

  return (
    <View style={styles.container}>
      {!scanned && (
        <Camera
          facing={facing}
          torchOn={torchOn}
          handleBarCodeScanned={handleBarCodeScanned}
          toggleTorch={toggleTorch}
        />
      )}
      {areAccountsSelected && <View>Loading</View>}
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
