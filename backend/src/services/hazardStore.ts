import { randomUUID } from 'node:crypto';

type HazardInput = {
  hazard_type: string;
  latitude: number;
  longitude: number;
  confidence: number;
  image_url?: string;
};

type Hazard = HazardInput & {
  id: string;
  status: string;
  report_count: number;
  created_at: string;
  last_seen_at: string;
};

const hazards: Hazard[] = [];

export function createHazard(input: HazardInput): Hazard {
  const now = new Date().toISOString();
  const existing = hazards.find((hazard) => {
    return hazard.hazard_type === input.hazard_type && distanceMeters(
      hazard.latitude,
      hazard.longitude,
      input.latitude,
      input.longitude,
    ) < 25;
  });

  if (existing) {
    existing.report_count += 1;
    existing.last_seen_at = now;
    existing.confidence = Math.max(existing.confidence, input.confidence);
    return existing;
  }

  const hazard: Hazard = {
    ...input,
    id: randomUUID(),
    status: 'active',
    report_count: 1,
    created_at: now,
    last_seen_at: now
  };

  hazards.unshift(hazard);
  return hazard;
}

export function listNearbyHazards(latitude: number, longitude: number, radiusMeters: number): Hazard[] {
  return hazards.filter((hazard) => {
    return hazard.status === 'active' && distanceMeters(latitude, longitude, hazard.latitude, hazard.longitude) <= radiusMeters;
  });
}

export function updateHazardStatus(id: string, status: string): Hazard | null {
  const hazard = hazards.find((item) => item.id === id);

  if (!hazard) {
    return null;
  }

  hazard.status = status;
  return hazard;
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}

