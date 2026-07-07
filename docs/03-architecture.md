# 03 - Architecture

## High-Level Flow

```txt
Mobile Camera
  -> Frame Capture
  -> AI Detector
  -> Detection Filter
  -> Alert Engine
  -> GPS Logger
  -> Local History
  -> Backend Sync Later
  -> Community Hazard Map Later
```

## Mobile App Modules

```txt
mobile_app/
  App.tsx
  src/components/DetectionOverlay.tsx
  src/components/StatusPill.tsx
  src/screens/CameraScreen.tsx
  src/screens/HistoryScreen.tsx
  src/screens/MapScreen.tsx
  src/screens/SettingsScreen.tsx
  src/services/mockDetector.ts
  src/services/alertEngine.ts
  src/storage/hazardHistory.ts
  src/types/detection.ts
```

## AI Modules

```txt
ai_model/
  data.yaml
  requirements.txt
  training_scripts/train_yolo.py
  training_scripts/run_video_demo.py
  datasets/
  exports/
```

## Backend Modules

```txt
backend/
  src/server.ts
  src/routes/hazards.ts
  src/services/hazardStore.ts
```

## Current MVP Behavior

- Mobile app uses mock detection for UI/demo.
- AI model scripts are ready for YOLO training and video testing.
- Backend stores hazards in memory for local API testing.

## Future Production Behavior

- Replace mock detector with TFLite/on-device model.
- Replace in-memory backend with SQLite/PostgreSQL.
- Add OpenStreetMap map view.
- Add community hazard reports.
