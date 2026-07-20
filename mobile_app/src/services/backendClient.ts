import { HazardReport } from '../types/detection';
import { BACKEND_API_URL } from '../config/inference';

export async function reportHazardToBackend(report: HazardReport): Promise<void> {
  if (report.latitude === null || report.longitude === null) {
    return;
  }

  try {
    await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hazard_type: report.type,
        latitude: report.latitude,
        longitude: report.longitude,
        confidence: report.confidence
      })
    });
  } catch {
    // Backend may be offline; local history in hazardHistory.ts is the source of truth on-device.
  }
}
