import { StyleSheet, Text, View } from 'react-native';
import { Detection } from '../types/detection';

type Props = {
  detections: Detection[];
};

export function DetectionOverlay({ detections }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {detections.map((detection) => (
        <View
          key={detection.id}
          style={[
            styles.box,
            {
              left: `${detection.box.x * 100}%`,
              top: `${detection.box.y * 100}%`,
              width: `${detection.box.width * 100}%`,
              height: `${detection.box.height * 100}%`
            }
          ]}
        >
          <Text style={styles.label} numberOfLines={1}>
            {detection.type.replace('_', ' ')} {Math.round(detection.confidence * 100)}%
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#ff3b30',
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: 6
  },
  label: {
    position: 'absolute',
    top: -28,
    left: 0,
    backgroundColor: '#ff3b30',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'capitalize'
  }
});
