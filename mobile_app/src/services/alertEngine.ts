import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Detection } from '../types/detection';

const labels: Record<Detection['type'], string> = {
  longitudinal_crack: 'Longitudinal crack ahead',
  transverse_crack: 'Transverse crack ahead',
  alligator_crack: 'Alligator crack ahead',
  pothole: 'Pothole ahead'
};

let lastAlertAt = 0;
let lastAlertType = '';

export async function alertForDetection(detection: Detection) {
  const now = Date.now();
  const cooldownMs = 5500;

  if (detection.confidence < 0.55) {
    return;
  }

  if (lastAlertType === detection.type && now - lastAlertAt < cooldownMs) {
    return;
  }

  lastAlertAt = now;
  lastAlertType = detection.type;

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  Speech.speak(labels[detection.type], { rate: 0.95, pitch: 1 });
}
