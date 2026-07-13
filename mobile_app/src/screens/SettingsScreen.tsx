import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export function SettingsScreen() {
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [vibrationAlerts, setVibrationAlerts] = useState(true);
  const [saveReports, setSaveReports] = useState(true);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Settings</Text>
      <SettingRow label="Voice alerts" value={voiceAlerts} onValueChange={setVoiceAlerts} />
      <SettingRow label="Vibration alerts" value={vibrationAlerts} onValueChange={setVibrationAlerts} />
      <SettingRow label="Save local reports" value={saveReports} onValueChange={setSaveReports} />
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
