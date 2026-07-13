# 05 - AI Training Guide

## Install Requirements

```bat
cd "D:\6th semester\computer vision\ai_model"
python -m pip install -r requirements.txt
```

## Configure Dataset

Update `ai_model/data.yaml` after placing dataset files.

Example:

```yaml
path: ./datasets/roadsense
train: images/train
val: images/val
test: images/test

names:
  0: pothole
  1: speed_breaker
  2: broken_road
  3: water_or_mud
  4: road_barrier
```

## Train Model

```bat
cd "D:\6th semester\computer vision\ai_model"
python training_scripts\train_yolo.py
```

Expected output:

```txt
runs/roadsense-yolov8n/weights/best.pt
```

## Test Model On Webcam

```bat
python training_scripts\run_video_demo.py --model runs\roadsense-yolov8n\weights\best.pt --source 0
```

## Test Model On Video

```bat
python training_scripts\run_video_demo.py --model runs\roadsense-yolov8n\weights\best.pt --source "D:\path\to\road_video.mp4"
```

## Metrics To Report

Use these in GitHub/LinkedIn/resume:

- mAP50
- precision
- recall
- inference FPS
- demo video result
- false positives/false negatives observed

## First Training Target

For resume MVP, target:

- 300-500 annotated images minimum
- 3 classes minimum
- short demo video with visible detections

## Current RoadSense Model

RoadSense has been trained on RDD2022 China Drone data, first as a CPU baseline and then retrained on a GPU for production-level accuracy.

Model:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

Previous CPU baseline kept as backup:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

Dataset counts:

```txt
train: 1345 images
val: 383 images
test: 191 images
```

Reproduce current training (Google Colab, T4 GPU):

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\train_yolo.py --epochs 150 --imgsz 640 --batch 16 --device 0 --patience 30
```

Previous CPU baseline command, kept for reference:

```bat
python training_scripts\train_yolo.py --epochs 10 --imgsz 416 --batch 4 --device cpu
```

Current test metrics (GPU, 150 epochs, imgsz 640):

```txt
precision: 0.673
recall: 0.665
mAP50: 0.648
mAP50-95: 0.369
```

Previous CPU baseline test metrics, kept for comparison:

```txt
precision: 0.328
recall: 0.429
mAP50: 0.379
mAP50-95: 0.155
pothole mAP50: 0.630
```
