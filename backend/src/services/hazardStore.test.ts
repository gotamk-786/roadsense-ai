import { beforeEach, describe, expect, it, vi } from 'vitest';

const fsMock = {
  existsSync: vi.fn(() => false),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(() => '[]'),
  writeFileSync: vi.fn()
};

vi.mock('node:fs', () => fsMock);

// Karachi-ish coordinates used as a base point for distance tests.
const BASE_LAT = 24.8607;
const BASE_LNG = 67.0011;
// Roughly 1km east of BASE_LAT/BASE_LNG — well outside the 25m/500m thresholds used below.
const FAR_LAT = 24.8607;
const FAR_LNG = 67.0121;

async function freshStore() {
  vi.resetModules();
  return import('./hazardStore.js');
}

beforeEach(() => {
  vi.clearAllMocks();
  fsMock.existsSync.mockReturnValue(false);
  fsMock.readFileSync.mockReturnValue('[]');
});

describe('createHazard', () => {
  it('creates a new hazard with generated id, active status and report_count 1', async () => {
    const { createHazard } = await freshStore();

    const hazard = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.8
    });

    expect(hazard.id).toBeTruthy();
    expect(hazard.status).toBe('active');
    expect(hazard.report_count).toBe(1);
    expect(hazard.created_at).toBe(hazard.last_seen_at);
    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
  });

  it('merges a duplicate report of the same type within 25 meters', async () => {
    const { createHazard } = await freshStore();

    const first = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.6
    });

    const second = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT + 0.00005,
      longitude: BASE_LNG,
      confidence: 0.9
    });

    expect(second.id).toBe(first.id);
    expect(second.report_count).toBe(2);
    expect(second.confidence).toBe(0.9);
  });

  it('keeps the higher confidence value when merging duplicates', async () => {
    const { createHazard } = await freshStore();

    createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.9
    });

    const merged = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.4
    });

    expect(merged.confidence).toBe(0.9);
  });

  it('does not merge reports of a different hazard_type at the same location', async () => {
    const { createHazard } = await freshStore();

    const first = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.6
    });

    const second = createHazard({
      hazard_type: 'speed_breaker',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.6
    });

    expect(second.id).not.toBe(first.id);
    expect(second.report_count).toBe(1);
  });

  it('does not merge reports more than 25 meters apart', async () => {
    const { createHazard } = await freshStore();

    const first = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.6
    });

    const second = createHazard({
      hazard_type: 'pothole',
      latitude: FAR_LAT,
      longitude: FAR_LNG,
      confidence: 0.6
    });

    expect(second.id).not.toBe(first.id);
  });
});

describe('listNearbyHazards', () => {
  it('returns hazards within the given radius', async () => {
    const { createHazard, listNearbyHazards } = await freshStore();

    createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.7
    });

    const results = listNearbyHazards(BASE_LAT, BASE_LNG, 500);

    expect(results).toHaveLength(1);
  });

  it('excludes hazards outside the given radius', async () => {
    const { createHazard, listNearbyHazards } = await freshStore();

    createHazard({
      hazard_type: 'pothole',
      latitude: FAR_LAT,
      longitude: FAR_LNG,
      confidence: 0.7
    });

    const results = listNearbyHazards(BASE_LAT, BASE_LNG, 500);

    expect(results).toHaveLength(0);
  });

  it('excludes hazards that are not active', async () => {
    const { createHazard, listNearbyHazards, updateHazardStatus } = await freshStore();

    const hazard = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.7
    });

    updateHazardStatus(hazard.id, 'fixed');

    const results = listNearbyHazards(BASE_LAT, BASE_LNG, 500);

    expect(results).toHaveLength(0);
  });
});

describe('updateHazardStatus', () => {
  it('updates the status of an existing hazard', async () => {
    const { createHazard, updateHazardStatus } = await freshStore();

    const hazard = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.7
    });

    const updated = updateHazardStatus(hazard.id, 'false_positive');

    expect(updated?.status).toBe('false_positive');
  });

  it('returns null for an unknown id', async () => {
    const { updateHazardStatus } = await freshStore();

    const updated = updateHazardStatus('does-not-exist', 'fixed');

    expect(updated).toBeNull();
  });
});

describe('getHazardStats', () => {
  it('aggregates totals by type and status', async () => {
    const { createHazard, updateHazardStatus, getHazardStats } = await freshStore();

    const a = createHazard({
      hazard_type: 'pothole',
      latitude: BASE_LAT,
      longitude: BASE_LNG,
      confidence: 0.7
    });
    createHazard({
      hazard_type: 'speed_breaker',
      latitude: FAR_LAT,
      longitude: FAR_LNG,
      confidence: 0.7
    });
    updateHazardStatus(a.id, 'fixed');

    const stats = getHazardStats();

    expect(stats.total).toBe(2);
    expect(stats.active).toBe(1);
    expect(stats.by_type).toEqual({ pothole: 1, speed_breaker: 1 });
    expect(stats.by_status).toEqual({ fixed: 1, active: 1 });
  });
});
