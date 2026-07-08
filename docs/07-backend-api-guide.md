# 07 - Backend API Guide

## Run Backend

```bat
cd "D:\6th semester\computer vision\backend"
npm.cmd install
npm.cmd run dev
```

## Health Check

```http
GET /health
```

Response:

```json
{
  "ok": true,
  "service": "roadsense-ai-backend"
}
```

## Create Hazard

```http
POST /api/hazards
```

Body:

```json
{
  "hazard_type": "pothole",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "confidence": 0.82
}
```

## Get Nearby Hazards

```http
GET /api/hazards/nearby?lat=24.8607&lng=67.0011&radius=500
```

## Get Hazard Stats

```http
GET /api/hazards/stats
```

Response:

```json
{
  "total": 12,
  "active": 10,
  "by_type": {
    "pothole": 8,
    "broken_road": 4
  },
  "by_status": {
    "active": 10,
    "fixed": 2
  }
}
```

## Update Hazard Status

```http
PATCH /api/hazards/:id
```

Body:

```json
{
  "status": "fixed"
}
```

Allowed status values:

- active
- fixed
- false_positive
- archived

## Current Storage

The backend now uses local file-backed persistence.

Data file:

```txt
backend/data/hazards.json
```

This file is ignored by Git because it contains local runtime data.

Future production upgrade:

- SQLite or PostgreSQL
- PostGIS for accurate nearby search
- authentication and user-owned reports
