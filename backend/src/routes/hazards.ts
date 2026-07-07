import { Router } from 'express';
import { z } from 'zod';
import { createHazard, listNearbyHazards, updateHazardStatus } from '../services/hazardStore.js';

export const hazardsRouter = Router();

const createHazardSchema = z.object({
  hazard_type: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  confidence: z.number().min(0).max(1),
  image_url: z.string().url().optional()
});

hazardsRouter.post('/', (req, res) => {
  const parsed = createHazardSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const hazard = createHazard(parsed.data);
  return res.status(201).json(hazard);
});

hazardsRouter.get('/nearby', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = req.query.radius ? Number(req.query.radius) : 500;

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: 'lat and lng are required numbers' });
  }

  return res.json(listNearbyHazards(lat, lng, radius));
});

hazardsRouter.patch('/:id', (req, res) => {
  const status = typeof req.body.status === 'string' ? req.body.status : null;

  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }

  const updated = updateHazardStatus(req.params.id, status);

  if (!updated) {
    return res.status(404).json({ error: 'hazard not found' });
  }

  return res.json(updated);
});
