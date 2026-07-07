# Backend

Simple Express API for RoadSense AI hazard reports.

## Run

```bash
npm install
npm run dev
```

## Endpoints

```txt
GET    /health
POST   /api/hazards
GET    /api/hazards/nearby?lat=24.8607&lng=67.0011&radius=500
PATCH  /api/hazards/:id
```

This MVP uses in-memory storage. Replace `src/services/hazardStore.ts` with PostgreSQL/Firebase later.
