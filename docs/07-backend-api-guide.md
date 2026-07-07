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

## Current Storage

The MVP backend uses in-memory storage.

Next free upgrade:

- SQLite
- local PostgreSQL
- JSON export
