import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '../services/useFocusEffect';
import { HazardReport } from '../types/detection';
import { clearHazardHistory, loadHazardHistory } from '../storage/hazardHistory';

export function HistoryScreen() {
  const [reports, setReports] = useState<HazardReport[]>([]);

  const refresh = useCallback(() => {
    loadHazardHistory().then(setReports);
  }, []);

  useFocusEffect(refresh);

  async function clearAll() {
    await clearHazardHistory();
    refresh();
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Detection History</Text>
        <Pressable onPress={clearAll} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hazard reports yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.rowTitle}>{item.type.replace('_', ' ')}</Text>
              <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.meta}>
                {item.latitude && item.longitude
                  ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`
                  : 'Location unavailable'}
              </Text>
            </View>
            <Text style={styles.confidence}>{Math.round(item.confidence * 100)}%</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101214'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800'
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#3f444b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  clearText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  list: {
    padding: 14,
    gap: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#181b1f',
    borderWidth: 1,
    borderColor: '#2c3138',
    borderRadius: 8,
    padding: 14
  },
  rowTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  meta: {
    color: '#aab0b8',
    marginTop: 4,
    fontSize: 12
  },
  confidence: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '800'
  },
  empty: {
    color: '#aab0b8',
    textAlign: 'center',
    marginTop: 40
  }
});
