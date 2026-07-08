# RoadSense AI Mobile App

React Native + Expo mobile MVP for live road hazard detection.

## Current MVP

- Camera preview
- Mock hazard detector
- Bounding-box overlay
- Voice and vibration alerts
- GPS-based detection history
- Map/settings placeholder screens

## Why React Native

React Native is better than plain React for this app because this project needs mobile camera, GPS, vibration, speech, and on-device AI support.

## Run

```bash
npm install
npm run start
```

Then open with Expo Go or Android emulator.

## Next AI Step

Replace `src/services/mockDetector.ts` with a real model runner:

Current real-road direction:

- ONNX model stored in `assets/models/roadsense-rdd2022-yolov8n-best.onnx`
- On-device runner scaffolded in `src/services/onDeviceDetector.ts`
- Enable with `EXPO_PUBLIC_USE_ON_DEVICE_INFERENCE=true`
- Requires Expo development build or Android APK, not Expo Go

## Real Road Android Build

Expo Go cannot load `onnxruntime-react-native`.

Generate native Android project:

```bash
npm run prebuild:android
```

Run on connected Android device after Android Studio/platform-tools setup:

```bash
npm run dev:android
```
