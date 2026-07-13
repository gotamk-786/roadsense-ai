import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Detection } from '../types/detection';
import { DetectionOverlay } from '../components/DetectionOverlay';
import { StatusPill } from '../components/StatusPill';
import { alertForDetection } from '../services/alertEngine';
import { runMockDetection } from '../services/mockDetector';
import { runApiDetection } from '../services/inferenceClient';
import { runOnDeviceDetection, warmOnDeviceDetector } from '../services/onDeviceDetector';
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
  const isProcessingRef = useRef(false);
  const lastAlertAtRef = useRef(0);
  const lastLocationRef = useRef<Location.LocationObject | null>(null);

  const detectionIntervalMs = USE_ON_DEVICE_INFERENCE ? 2600 : 1400;

  useEffect(() => {
    requestCameraPermission();
    Location.requestForegroundPermissionsAsync().then((result) => {
      setLocationGranted(result.status === 'granted');
    });
  }, [requestCameraPermission]);

  useEffect(() => {
    if (USE_ON_DEVICE_INFERENCE) {
      setLastAlert('Loading on-device model');
      warmOnDeviceDetector()
        .then(() => setLastAlert('On-device AI ready'))
        .catch(() => setLastAlert('On-device AI unavailable'));
    }
  }, []);

  useEffect(() => {
    if (!isDetecting || !cameraPermission?.granted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(async () => {
      if (isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      let result: Detection[] = [];
      try {
        if (USE_ON_DEVICE_INFERENCE && cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.45,
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
        setLastAlert(USE_ON_DEVICE_INFERENCE ? 'On-device AI unavailable' : 'Inference API unavailable');
        result = [];
      } finally {
        isProcessingRef.current = false;
      }

      setDetections(result);

      const strongest = result[0];
      if (!strongest) {
        setLastAlert('No hazard detected');
        return;
      }

      setLastAlert(`${strongest.type.replace('_', ' ')} detected`);
      const now = Date.now();
      if (now - lastAlertAtRef.current > 3500) {
        lastAlertAtRef.current = now;
        await alertForDetection(strongest);
      }

      if (locationGranted && now - (lastLocationRef.current?.timestamp ?? 0) > 5000) {
        lastLocationRef.current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
      }

      const location = lastLocationRef.current;
      await saveHazardReport({
        id: strongest.id,
        type: strongest.type,
        confidence: strongest.confidence,
        latitude: location?.coords.latitude ?? null,
        longitude: location?.coords.longitude ?? null,
        createdAt: strongest.createdAt
      });
    }, detectionIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraPermission?.granted, detectionIntervalMs, isDetecting, locationGranted]);

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
