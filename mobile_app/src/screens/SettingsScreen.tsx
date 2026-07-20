import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { AppSettings, defaultAppSettings, loadAppSettings, saveAppSettings } from '../storage/appSettings';

export function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadAppSettings().then((value) => {
      setSettings(value);
      setLoaded(true);
    });
  }, []);

  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAppSettings(next);
  }

  if (!loaded) {
    return <SafeAreaView style={styles.root} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Settings</Text>
      <SettingRow
        label="Voice alerts"
        value={settings.voiceAlerts}
        onValueChange={(value) => updateSetting('voiceAlerts', value)}
      />
      <SettingRow
        label="Vibration alerts"
        value={settings.vibrationAlerts}
        onValueChange={(value) => updateSetting('vibrationAlerts', value)}
      />
      <SettingRow
        label="Save local reports"
        value={settings.saveReports}
        onValueChange={(value) => updateSetting('saveReports', value)}
      />
    </SafeAreaView>
  );
}

type SettingRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingRow({ label, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
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
    fontWeight: '800',
    marginBottom: 16
  },
  row: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#2c3138'
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
});
