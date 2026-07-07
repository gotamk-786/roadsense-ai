import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export function MapScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Hazard Map</Text>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Next step</Text>
        <Text style={styles.copy}>
          Add Google Maps or Mapbox here and plot saved hazard reports as markers.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101214',
    padding: 18
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800'
  },
  panel: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2c3138',
    backgroundColor: '#181b1f',
    padding: 16
  },
  panelTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18
  },
  copy: {
    color: '#aab0b8',
    marginTop: 8,
    lineHeight: 20
  }
});
