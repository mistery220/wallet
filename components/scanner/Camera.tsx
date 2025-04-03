import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { CameraType, CameraView } from "expo-camera";

const SCANNER_SIZE = 250;
const CORNER_SIZE = 30;
const BORDER_WIDTH = 4;

const Camera = ({
  facing,
  torchOn,
  handleBarCodeScanned,
  toggleTorch,
}: {
  facing: CameraType;
  torchOn: boolean;
  handleBarCodeScanned: ({ data }: any) => void;
  toggleTorch: () => void;
}) => {
  useEffect(() => {}, [torchOn]);
  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      enableTorch={torchOn}
      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      onBarcodeScanned={handleBarCodeScanned}
      zoom={0.7}
    >
      <View style={styles.overlay}>
        <View style={styles.scannerArea}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleTorch} style={styles.controlButton}>
            <Text style={styles.controlText}>
              {torchOn ? "Turn Off Torch" : "Turn On Torch"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  controlButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
  },
  controlText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scannerArea: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: "relative",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: "white",
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: "white",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderColor: "white",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    borderColor: "white",
  },
});
