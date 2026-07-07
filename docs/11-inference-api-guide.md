# 11 - Inference API Guide

## Purpose

This API connects the trained YOLO road damage model with the app layer.

Current model:

```txt
ai_model/exports/roadsense-rdd2022-yolov8n-best.pt
```

Current supported classes from the trained dataset:

- longitudinal_crack
- transverse_crack
- alligator_crack
- pothole

The mobile app maps crack labels to `broken_road` for a simpler driver-facing alert.

## Install Dependencies

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python -m pip install -r requirements.txt
```

## Run API

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python inference_api\server.py --host 127.0.0.1 --port 8000 --conf 0.35
```

Health check:

```txt
http://127.0.0.1:8000/health
```

Prediction endpoint:

```txt
POST http://127.0.0.1:8000/predict
Content-Type: multipart/form-data
field: file
```

## Test With Sample Image

Start the API first, then run:

```bat
cd "D:\6th semester\computer vision\ai_model"
python inference_api\test_client.py --image datasets\roadsense\images\test\China_Drone_000237.jpg
```

Verified result on the current trained model:

```txt
pothole 0.9905
pothole 0.9035
```

## Mobile App Switch

File:

```txt
mobile_app/src/config/inference.ts
```

Default:

```ts
export const USE_REAL_INFERENCE = false;
export const INFERENCE_API_URL = 'http://127.0.0.1:8000/predict';
```

For a real Android phone using Expo Go, replace `127.0.0.1` with the PC LAN IP:

```ts
export const USE_REAL_INFERENCE = true;
export const INFERENCE_API_URL = 'http://192.168.1.20:8000/predict';
```

Both phone and laptop must be on the same Wi-Fi network.

## Industry Notes

This API is good for local demo, resume video, and GitHub proof of integration.

Production path later:

1. Export YOLO to ONNX/TFLite.
2. Run inference on-device for low latency.
3. Keep backend for hazard reports, maps, and community verification.
4. Add database persistence and authentication.
5. Add automated evaluation before every model release.
