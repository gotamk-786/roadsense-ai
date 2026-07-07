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

- Option A: `react-native-fast-tflite` for TFLite in a bare React Native app
- Option B: `@tensorflow/tfjs-react-native` for TensorFlow.js models
- Option C: native Android/Kotlin model bridge for maximum performance

Recommended production path: train YOLOv8n, export to TFLite, then run with `react-native-fast-tflite` after ejecting/prebuilding from Expo.
