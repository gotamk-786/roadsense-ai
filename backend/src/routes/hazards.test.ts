import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/hazardStore.js', () => ({
  createHazard: vi.fn(),
  listNearbyHazards: vi.fn(),
  getHazardStats: vi.fn(),
  updateHazardStatus: vi.fn()
}));

const { createHazard, listNearbyHazards, getHazardStats, updateHazardStatus } = await import(
  '../services/hazardStore.js'
);
const { hazardsRouter } = await import('./hazards.js');

const app = express();
app.use(express.json());
app.use('/api/hazards', hazardsRouter);

const validPayload = {
  hazard_type: 'pothole',
  latitude: 24.8607,
  longitude: 67.0011,
  confidence: 0.82
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/hazards', () => {
  it('creates a hazard and returns 201 for a valid payload', async () => {
    const created = { ...validPayload, id: 'abc', status: 'active', report_count: 1 };
    vi.mocked(createHazard).mockReturnValue(created as never);

    const res = await request(app).post('/api/hazards').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(createHazard).toHaveBeenCalledWith(validPayload);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/api/hazards').send({ hazard_type: 'pothole' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    expect(createHazard).not.toHaveBeenCalled();
  });

  it('returns 400 when confidence is outside 0-1', async () => {
    const res = await request(app)
      .post('/api/hazards')
      .send({ ...validPayload, confidence: 1.5 });

    expect(res.status).toBe(400);
    expect(createHazard).not.toHaveBeenCalled();
  });

  it('returns 400 when image_url is not a valid url', async () => {
    const res = await request(app)
      .post('/api/hazards')
      .send({ ...validPayload, image_url: 'not-a-url' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/hazards/nearby', () => {
  it('returns hazards for valid lat/lng', async () => {
    vi.mocked(listNearbyHazards).mockReturnValue([{ id: '1' }] as never);

    const res = await request(app).get('/api/hazards/nearby').query({ lat: 24.86, lng: 67.0 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1' }]);
    expect(listNearbyHazards).toHaveBeenCalledWith(24.86, 67.0, 500);
  });

  it('passes through a custom radius', async () => {
    vi.mocked(listNearbyHazards).mockReturnValue([] as never);

    await request(app).get('/api/hazards/nearby').query({ lat: 24.86, lng: 67.0, radius: 100 });

    expect(listNearbyHazards).toHaveBeenCalledWith(24.86, 67.0, 100);
  });

  it('returns 400 when lat is missing', async () => {
    const res = await request(app).get('/api/hazards/nearby').query({ lng: 67.0 });

    expect(res.status).toBe(400);
    expect(listNearbyHazards).not.toHaveBeenCalled();
  });

  it('returns 400 when lat/lng are not numeric', async () => {
    const res = await request(app)
      .get('/api/hazards/nearby')
      .query({ lat: 'abc', lng: 'def' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/hazards/stats', () => {
  it('returns stats from the store', async () => {
    const stats = { total: 3, active: 2, by_type: {}, by_status: {} };
    vi.mocked(getHazardStats).mockReturnValue(stats as never);

    const res = await request(app).get('/api/hazards/stats');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(stats);
  });
});

describe('PATCH /api/hazards/:id', () => {
  it('updates status for a valid enum value', async () => {
    const updated = { id: 'abc', status: 'fixed' };
    vi.mocked(updateHazardStatus).mockReturnValue(updated as never);

    const res = await request(app).patch('/api/hazards/abc').send({ status: 'fixed' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(updateHazardStatus).toHaveBeenCalledWith('abc', 'fixed');
  });

  it('returns 400 for an invalid status value', async () => {
    const res = await request(app).patch('/api/hazards/abc').send({ status: 'not_a_status' });

    expect(res.status).toBe(400);
    expect(updateHazardStatus).not.toHaveBeenCalled();
  });

  it('returns 404 when the hazard does not exist', async () => {
    vi.mocked(updateHazardStatus).mockReturnValue(null);

    const res = await request(app).patch('/api/hazards/missing').send({ status: 'fixed' });

    expect(res.status).toBe(404);
  });
});
