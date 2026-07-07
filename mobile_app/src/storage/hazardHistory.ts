import AsyncStorage from '@react-native-async-storage/async-storage';
import { HazardReport } from '../types/detection';

const KEY = 'roadsense:hazard-history';

export async function loadHazardHistory(): Promise<HazardReport[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as HazardReport[]) : [];
}

export async function saveHazardReport(report: HazardReport): Promise<void> {
  const current = await loadHazardHistory();
  const next = [report, ...current].slice(0, 100);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function clearHazardHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
