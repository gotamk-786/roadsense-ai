# API

## Create Hazard

```http
POST /api/hazards
```

```json
{
  "hazard_type": "pothole",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "confidence": 0.82
}
```

## Nearby Hazards

```http
GET /api/hazards/nearby?lat=24.8607&lng=67.0011&radius=500
```
