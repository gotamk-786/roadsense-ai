import { useEffect, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Detection } from '../types/detection';
import { DetectionOverlay } from '../components/DetectionOverlay';
import { StatusPill } from '../components/StatusPill';
import { alertForDetection } from '../services/alertEngine';
import { runMockDetection } from '../services/mockDetector';
import { runApiDetection } from '../services/inferenceClient';
import { runOnDeviceDetection } from '../services/onDeviceDetector';
import { saveHazardReport } from '../storage/hazardHistory';
import { INFERENCE_API_URL, USE_ON_DEVICE_INFERENCE, USE_REAL_INFERENCE } from '../config/inference';

export function CameraScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationGranted, setLocationGranted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [lastAlert, setLastAlert] = useState('No hazard detected');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    requestCameraPermission();
    Location.requestForegroundPermissionsAsync().then((result) => {
      setLocationGranted(result.status === 'granted');
    });
  }, [requestCameraPermission]);

  useEffect(() => {
    if (!isDetecting || !cameraPermission?.granted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(async () => {
      let result: Detection[] = [];
      try {
        if (USE_ON_DEVICE_INFERENCE && cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.65,
            skipProcessing: true
          });
          result = photo?.uri ? await runOnDeviceDetection(photo.uri) : [];
        } else if (USE_REAL_INFERENCE && cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.45,
            skipProcessing: true
          });
          result = photo?.uri ? await runApiDetection(photo.uri, INFERENCE_API_URL) : [];
        } else {
          result = await runMockDetection();
        }
      } catch (error) {
        setLastAlert('Inference API unavailable');
        result = [];
      }

      setDetections(result);

      const strongest = result[0];
      if (!strongest) {
        return;
      }

      setLastAlert(`${strongest.type.replace('_', ' ')} detected`);
      await alertForDetection(strongest);

      const location = locationGranted ? await Location.getCurrentPositionAsync({}) : null;
      await saveHazardReport({
        id: strongest.id,
        type: strongest.type,
        confidence: strongest.confidence,
        latitude: location?.coords.latitude ?? null,
        longitude: location?.coords.longitude ?? null,
        createdAt: strongest.createdAt
      });
    }, 1400);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraPermission?.granted, isDetecting, locationGranted]);

  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>Camera permission required</Text>
        <Text style={styles.copy}>RoadSense AI needs camera access to detect hazards.</Text>
        <Pressable style={styles.primaryButton} onPress={requestCameraPermission}>
          <Text style={styles.primaryButtonText}>Allow Camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
      <DetectionOverlay detections={detections} />

      <SafeAreaView style={styles.chrome}>
        <View style={styles.topBar}>
          <StatusPill label={isDetecting ? 'AI active' : 'Paused'} tone={isDetecting ? 'green' : 'yellow'} />
          <StatusPill label={locationGranted ? 'GPS ready' : 'GPS off'} tone={locationGranted ? 'green' : 'red'} />
        </View>

        <View style={styles.alertPanel}>
          <Text style={styles.alertLabel}>Current alert</Text>
          <Text style={styles.alertText}>{lastAlert}</Text>
        </View>

        <Pressable style={styles.controlButton} onPress={() => setIsDetecting((value) => !value)}>
          <Text style={styles.controlButtonText}>{isDetecting ? 'Pause Detection' : 'Start Detection'}</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505'
  },
  chrome: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  alertPanel: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.66)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    padding: 16
  },
  alertLabel: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  alertText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'capitalize'
  },
  controlButton: {
    alignSelf: 'center',
    minWidth: 180,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 10
  },
  controlButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 15
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#111111'
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center'
  },
  copy: {
    color: '#c7c7c7',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 12
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: '#111111',
    fontWeight: '800'
  }
});
