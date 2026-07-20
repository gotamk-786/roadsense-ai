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

Export command (current v2 model, imgsz 640, 3 classes):

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\export_mobile_model.py --model exports\roadsense-v2-yolov8n-best.pt --format onnx --imgsz 640
```

Expected output:

```txt
ai_model/exports/mobile/roadsense-v2-yolov8n-best.onnx
```

This gets copied into the mobile app:

```txt
mobile_app/assets/models/roadsense-v2-yolov8n-best.onnx
```

Note: `mobile_app/src/services/onDeviceDetector.ts` has an `inputSize` constant that must match the export's `imgsz` (currently `640`), and a `labels` array that must match the model's class order (currently `['crack', 'pothole', 'manhole']` for v2).

Verification result (v1 export at imgsz=416, kept for historical reference):

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
mobile_app/assets/models/roadsense-v2-yolov8n-best.onnx
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
- On-device loop optimized to avoid overlapping inference calls
- Alert cooldown added to reduce repeated speech/vibration
- Location lookup throttled to reduce GPS overhead
- Android SDK moved to `D:\Android\Sdk` to reduce C-drive pressure

Blocked on this machine:

- `gradlew assembleDebug` reaches native Gradle compile but is too slow/stalls on this laptop.
- `adb` is not on PATH, although Android platform tools exist under `D:\Android\Sdk`.
- Debug APK has not been produced yet.

To finish APK build:

1. Add `D:\Android\Sdk\platform-tools` to PATH for `adb`.
2. Keep Gradle cache and temp folders on D drive:

```bat
set GRADLE_USER_HOME=D:\gradle_roadsense
set TEMP=D:\roadsense_tmp
set TMP=D:\roadsense_tmp
```

3. Build:

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd run build:android:debug
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
