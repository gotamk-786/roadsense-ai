# 13 - Real Road Mobile Plan

## Why Wi-Fi API Is Not Enough

The local FastAPI server is good for demos, but it needs the phone and laptop on the same network. On the road, that is not reliable.

For real road use, inference must run on the phone.

## Target Architecture

```txt
Phone camera -> on-device model -> detections -> alert engine -> local history/GPS
```

No laptop, no home Wi-Fi, no backend required for live alerts.

Backend remains useful later for:

- community reports
- maps
- synced history
- admin/fleet dashboard

## Current Status

Done:

- YOLO `.pt` model trained
- local inference API tested
- Expo mobile app working as UI/demo app
- mobile export script added
- ONNX mobile model exported and tested
- React Native ONNX runtime dependency added
- On-device detector scaffold added in mobile app

Export command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\export_mobile_model.py --format onnx --imgsz 416
```

Expected output:

```txt
ai_model/exports/mobile/
```

Current verified mobile export:

```txt
ai_model/exports/mobile/roadsense-rdd2022-yolov8n-best.onnx
```

Verification result:

```txt
Image: datasets/roadsense/images/test/China_Drone_000237.jpg
Result: 2 potholes detected
ONNX Runtime CPU inference: about 89 ms on laptop
```

## Recommended Real Road Build

Expo Go cannot run custom native AI inference libraries. For real road use, build an Expo development build or bare React Native Android app.

Recommended path:

1. Export model to ONNX first.
2. Add `onnxruntime-react-native`.
3. Add camera frame/image capture pipeline.
4. Run model on-device.
5. Convert model output to RoadSense `Detection[]`.
6. Keep voice, vibration, GPS, and history logic already present in the app.

Current implementation files:

```txt
mobile_app/assets/models/roadsense-rdd2022-yolov8n-best.onnx
mobile_app/src/services/onDeviceDetector.ts
mobile_app/src/config/inference.ts
mobile_app/android/
```

Enable local Android/dev-build mode with:

```txt
EXPO_PUBLIC_USE_ON_DEVICE_INFERENCE=true
EXPO_PUBLIC_USE_REAL_INFERENCE=false
```

## Local Build Status

Completed:

- `onnxruntime-react-native` installed
- `expo-dev-client` installed
- ONNX model copied into mobile assets
- Android native project generated with `npm run prebuild:android`
- TypeScript compile passes

Blocked on this machine:

- `gradlew assembleDebug` did not finish because Gradle/Android build exhausted available disk/pagefile resources.
- `adb` is not installed or not on PATH.
- Android SDK environment variables are not configured.

To finish APK build:

1. Install Android Studio.
2. Install Android SDK Platform 35 or latest Expo SDK 54 compatible platform.
3. Install Android SDK Build Tools and Platform Tools.
4. Add `adb` to PATH.
5. Keep Gradle cache on D drive:

```bat
set GRADLE_USER_HOME=D:\6th semester\computer vision\mobile_app\.gradle-home
```

6. Build:

```bat
cd "D:\6th semester\computer vision\mobile_app\android"
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot
set GRADLE_USER_HOME=D:\6th semester\computer vision\mobile_app\.gradle-home
gradlew.bat assembleDebug
```

Expected APK:

```txt
mobile_app/android/app/build/outputs/apk/debug/app-debug.apk
```

## Practical Development Phases

### Phase 1 - Current Demo

- Expo Go
- mock detections or laptop API
- good for GitHub/LinkedIn demo

### Phase 2 - Real Road APK

- Expo development build
- on-device ONNX/TFLite inference
- works without Wi-Fi

### Phase 3 - Production

- optimized model
- lower latency camera frames
- offline queue for reports
- sync reports when internet is available
- map/community warnings

## Important Note

Real road live detection needs either:

- an Android development build installed on the phone, or
- a native Android app.

Expo Go alone is not enough because it cannot load custom native AI runtime modules.
