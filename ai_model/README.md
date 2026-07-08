# AI Model

YOLO training workspace for RoadSense AI.

## Important: Use D-Drive Environment

Do not install AI dependencies globally on C drive. Use the project virtual environment and cache folders on D drive.

## Install Dependencies

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\install_deps_d_drive.ps1
```

This creates/uses:

```txt
.venv/          Python virtual environment
.pip-cache/     pip download cache
.tmp/           temp files
.torch-cache/   torch/model cache
.ultralytics/   YOLO settings/cache
```

## Activate Environment

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
```

## Verify Environment

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\verify_env.ps1
```

## Dataset Format

Use YOLO format:

```txt
datasets/roadsense/
  images/train
  images/val
  images/test
  labels/train
  labels/val
  labels/test
```

## Train

Training requires dataset files first.

```bat
python training_scripts\train_yolo.py
```

## Test Pretrained YOLO On Webcam

```bat
python training_scripts\run_video_demo.py --model yolov8n.pt --source 0
```

## Test Video

```bat
python training_scripts\run_video_demo.py --model yolov8n.pt --source "D:\path\to\road_video.mp4"
```

## Current Trained RoadSense Model

Dataset has already been downloaded and converted to YOLO format.

```txt
datasets/roadsense
  train: 1345 images
  val: 383 images
  test: 191 images
```

Trained baseline model:

```txt
exports/roadsense-rdd2022-yolov8n-best.pt
```

Re-train command:

```bat
python training_scripts\train_yolo.py --epochs 10 --imgsz 416 --batch 4 --device cpu
```

Run demo with trained model:

```bat
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```

## Export For Real Road Mobile Use

The `.pt` model is for Python. For road use without laptop/Wi-Fi, export a mobile-friendly model:

```bat
python training_scripts\export_mobile_model.py --format onnx --imgsz 416
```

Output folder:

```txt
exports/mobile/
```

Current verified export:

```txt
exports/mobile/roadsense-rdd2022-yolov8n-best.onnx
```

Quick ONNX test:

```bat
python training_scripts\run_video_demo.py --model exports\mobile\roadsense-rdd2022-yolov8n-best.onnx --source datasets\roadsense\images\test\China_Drone_000237.jpg --save --name roadsense-onnx-test
```

Recommended next mobile runtime:

- ONNX: `onnxruntime-react-native` with Expo development build
- TFLite: `react-native-fast-tflite` with Expo development build or bare React Native
