import { ComponentType, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewProps } from 'react-native-webview';
import { useFocusEffect } from '../services/useFocusEffect';
import { HazardReport } from '../types/detection';
import { loadHazardHistory } from '../storage/hazardHistory';

// react-native-webview's class-component types don't resolve cleanly against
// React 19's type definitions; cast once so JSX usage below type-checks.
const MapWebView = WebView as unknown as ComponentType<WebViewProps & { ref?: React.Ref<WebView> }>;

const MARKER_COLORS: Record<HazardReport['type'], string> = {
  crack: '#facc15',
  pothole: '#ef4444',
  manhole: '#38bdf8'
};

function buildMapHtml(points: HazardReport[]): string {
  const located = points.filter((p) => p.latitude != null && p.longitude != null);
  const center = located.length
    ? [located[0].latitude, located[0].longitude]
    : [0, 0];

  const markers = located
    .map((p) => {
      const color = MARKER_COLORS[p.type];
      const label = `${p.type} (${Math.round(p.confidence * 100)}%)<br/>${new Date(p.createdAt).toLocaleString()}`;
      return `L.circleMarker([${p.latitude}, ${p.longitude}], {radius: 9, color: '${color}', fillColor: '${color}', fillOpacity: 0.85, weight: 2}).addTo(map).bindPopup(${JSON.stringify(label)});`;
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #101214; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', { zoomControl: true }).setView([${center[0]}, ${center[1]}], ${located.length ? 15 : 2});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);
    ${markers}
  </script>
</body>
</html>`;
}

export function MapScreen() {
  const [reports, setReports] = useState<HazardReport[]>([]);
  const webViewRef = useRef<WebView>(null);

  useFocusEffect(() => {
    loadHazardHistory().then(setReports);
  });

  const located = useMemo(
    () => reports.filter((r) => r.latitude != null && r.longitude != null),
    [reports]
  );

  const html = useMemo(() => buildMapHtml(reports), [reports]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Hazard Map</Text>
        <Text style={styles.subtitle}>
          {located.length} of {reports.length} saved reports have GPS location
        </Text>
      </View>

      {located.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No located hazard reports yet. Detect a hazard on the Camera tab with GPS enabled to see it here.
          </Text>
        </View>
      ) : (
        <MapWebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html }}
          style={styles.map}
        />
      )}

      <View style={styles.legend}>
        {(Object.keys(MARKER_COLORS) as HazardReport['type'][]).map((type) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MARKER_COLORS[type] }]} />
            <Text style={styles.legendText}>{type}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101214'
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800'
  },
  subtitle: {
    color: '#aab0b8',
    marginTop: 4,
    fontSize: 12
  },
  map: {
    flex: 1
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32
  },
  emptyText: {
    color: '#aab0b8',
    textAlign: 'center',
    lineHeight: 20
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#242830'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  legendText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize'
  }
});
