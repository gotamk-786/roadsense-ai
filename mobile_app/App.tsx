import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { CameraScreen } from './src/screens/CameraScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MapScreen } from './src/screens/MapScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Tab = 'camera' | 'history' | 'map' | 'settings';

const tabs: { id: Tab; label: string }[] = [
  { id: 'camera', label: 'Camera' },
  { id: 'history', label: 'History' },
  { id: 'map', label: 'Map' },
  { id: 'settings', label: 'Settings' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('camera');

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <View style={styles.content}>{renderTab(activeTab)}</View>
        <SafeAreaView style={styles.navSafeArea} edges={['bottom']}>
          <View style={styles.nav}>
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[styles.navItem, active && styles.navItemActive]}
                >
                  <Text style={[styles.navText, active && styles.navTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

function renderTab(tab: Tab) {
  switch (tab) {
    case 'camera':
      return <CameraScreen />;
    case 'history':
      return <HistoryScreen />;
    case 'map':
      return <MapScreen />;
    case 'settings':
      return <SettingsScreen />;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101214'
  },
  content: {
    flex: 1
  },
  navSafeArea: {
    backgroundColor: '#0b0c0f'
  },
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#242830',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 8
  },
  navItem: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  navItemActive: {
    backgroundColor: '#ffffff'
  },
  navText: {
    color: '#aab0b8',
    fontSize: 12,
    fontWeight: '800'
  },
  navTextActive: {
    color: '#111111'
  }
});
