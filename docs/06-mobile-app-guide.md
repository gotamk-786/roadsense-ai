# 06 - Mobile App Guide

## Run App

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd run start
```

Scan the QR code using Expo Go.

## Current Screens

- Camera
- History
- Map placeholder
- Settings

## Camera Screen

Current behavior:

- Opens back camera
- Runs mock detection every few seconds
- Draws detection boxes
- Gives voice alert
- Gives vibration alert
- Saves GPS report to local history

## Detection History

Stores local reports with:

- hazard type
- confidence
- timestamp
- latitude
- longitude

## Replacing Mock Detection Later

Current file:

```txt
mobile_app/src/services/mockDetector.ts
```

Future replacement:

Real API client added:

```txt
mobile_app/src/services/inferenceClient.ts
mobile_app/src/config/inference.ts
```

Default mode is still mock detection so the app runs without backend/model setup.

To test the trained model through the local API:

1. Start `ai_model/inference_api/server.py`.
2. Open `mobile_app/src/config/inference.ts`.
3. Set `USE_REAL_INFERENCE = true`.
4. Replace `127.0.0.1` with the PC LAN IP if testing on a physical phone.

Future on-device replacement:

- TFLite model runner
- TensorFlow.js model runner
- native bridge for best performance

## Recommended Next Mobile Improvements

1. Add real model integration.
2. Add backend sync button.
3. Add OpenStreetMap view.
4. Add export/share detection history.
5. Add sensitivity settings.
