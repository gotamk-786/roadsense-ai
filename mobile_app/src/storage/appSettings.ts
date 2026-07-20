import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'roadsense:app-settings';

export type AppSettings = {
  voiceAlerts: boolean;
  vibrationAlerts: boolean;
  saveReports: boolean;
};

export const defaultAppSettings: AppSettings = {
  voiceAlerts: true,
  vibrationAlerts: true,
  saveReports: true
};

export async function loadAppSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return defaultAppSettings;
  }
  return { ...defaultAppSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings));
}
