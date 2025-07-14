import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { qrScannerService, DeviceConfig } from '@/lib/qrScanner';

interface QRScannerProps {
  onScanComplete: (device: DeviceConfig) => void;
  onClose: () => void;
}

export function QRScanner({ onScanComplete, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    console.log('QR Code scanned:', data);
    
    // First validate the QR code URL
    if (!qrScannerService.validateQRUrl(data)) {
      Alert.alert(
        'Invalid QR Code',
        'This QR code does not contain a valid ThingSpeak or KrishiMitra URL.',
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: onClose,
          },
        ]
      );
      return;
    }
    
    const deviceConfig = qrScannerService.parseQRData(data);
    
    if (deviceConfig) {
      const connected = await qrScannerService.connectDevice(deviceConfig);
      
      if (connected) {
        Alert.alert(
          'Device Connected',
          `Successfully connected to ${deviceConfig.deviceName}`,
          [
            {
              text: 'OK',
              onPress: () => onScanComplete(deviceConfig),
            },
          ]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          'Could not connect to the device. Please check the QR code and try again.',
          [
            {
              text: 'Try Again',
              onPress: () => setScanned(false),
            },
            {
              text: 'Cancel',
              onPress: onClose,
            },
          ]
        );
      }
    } else {
      Alert.alert(
        'Invalid QR Code',
        'This QR code does not contain valid device information.',
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Cancel',
            onPress: onClose,
          },
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Device QR Code</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Zap size={24} color={Colors.primary} />
        <Text style={styles.instructionText}>
          Point your camera at the QR code on your IoT device
        </Text>
      </View>

      {scanned && (
        <TouchableOpacity
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.text.inverse,
    textAlign: 'center',
    flex: 1,
  },
  message: {
    fontSize: 18,
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  rescanButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rescanButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});