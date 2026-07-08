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
