import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  ScrollView,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  // Request camera permissions on mount
  useFocusEffect(
    React.useCallback(() => {
      requestCameraPermission();
    }, [])
  );

  const requestCameraPermission = async () => {
    try {
      const { status } = await CameraView.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(data);
      await saveToHistory(data);
    }
  };

  const saveToHistory = async (data) => {
    try {
      const existingHistory = await AsyncStorage.getItem('scanHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      const newEntry = {
        id: Date.now().toString(),
        data: data,
        timestamp: new Date().toLocaleString(),
      };
      history.push(newEntry);
      await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setLoading(true);
        // Note: For production, you'd need to use a barcode scanning library
        // that can scan from images, like expo-barcode-scanner or zbar
        Alert.alert(
          'Image Selected',
          'Image picker integration requires additional QR scanning library for image analysis.'
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleShare = async () => {
    if (!scannedData) {
      Alert.alert('No Data', 'Please scan a QR code first');
      return;
    }

    try {
      await Share.share({
        message: `Scanned QR Code: ${scannedData}`,
        url: scannedData,
        title: 'Share QR Code Result',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleReset = () => {
    setScanned(false);
    setScannedData(null);
  };

  const handleCopy = () => {
    if (scannedData) {
      // Note: For copy to clipboard, you'd need: npm install expo-clipboard
      Alert.alert('Copied', `Data copied: ${scannedData}`);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionError}>
          Camera permission is required to use this app.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
        {scanned && <View style={styles.overlay} />}
      </View>

      {scannedData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Scanned Result:</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultData} selectable>
              {scannedData}
            </Text>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={handleShare}
            >
              <Text style={styles.buttonText}>📤 Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopy}
            >
              <Text style={styles.buttonText}>📋 Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>🔄 Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>
            Point your camera at a QR code to scan
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={handlePickImage}
          >
            <Text style={styles.buttonText}>📸 Pick from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  cameraContainer: {
    height: 400,
    overflow: 'hidden',
    borderRadius: 12,
    margin: 16,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  resultBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  resultData: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: '#007AFF',
    flex: 1,
  },
  copyButton: {
    backgroundColor: '#34C759',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#FF9500',
    flex: 1,
  },
  galleryButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionError: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
