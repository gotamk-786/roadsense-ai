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

Two versions have been trained. **v2 is the current active model** used by the mobile app.

### v2 (current active)

Model:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-v2-yolov8n-best.pt
```

Dataset: RDD2022 China Drone combined with a second real-road dataset (Kaggle "Road Damage Dataset: Potholes, Cracks and Manholes", real GoPro/phone photos). Merged with `training_scripts\prepare_combined_dataset.py`.

```txt
train: 2952 images
val: 583 images
test: 393 images
```

Classes (3): `crack`, `pothole`, `manhole`.

Prepare the combined dataset, then train:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\prepare_combined_dataset.py
python training_scripts\train_yolo.py --data data.yaml --epochs 200 --imgsz 640 --batch 16 --device 0 --patience 30 --name roadsense-v2-yolov8n
```

Test metrics (172 epochs, early stop at 142):

```txt
overall precision: 0.643
overall recall: 0.555
overall mAP50: 0.571
overall mAP50-95: 0.265
```

Per-class:

```txt
crack:    precision 0.603, recall 0.629, mAP50 0.623
pothole:  precision 0.561, recall 0.509, mAP50 0.485
manhole:  precision 0.767, recall 0.526, mAP50 0.605
```

### v1 (kept as backup)

Model:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

Dataset: RDD2022 China Drone only, 4 classes (`longitudinal_crack`, `transverse_crack`, `alligator_crack`, `pothole`).

```txt
train: 1345 images
val: 383 images
test: 191 images
```

Training command:

```bat
python training_scripts\train_yolo.py --epochs 150 --imgsz 640 --batch 16 --device 0 --patience 30
```

Test metrics:

```txt
precision: 0.673
recall: 0.665
mAP50: 0.648
mAP50-95: 0.369
```

### Original CPU baseline, kept for historical reference

```bat
python training_scripts\train_yolo.py --epochs 10 --imgsz 416 --batch 4 --device cpu
```

```txt
precision: 0.328
recall: 0.429
mAP50: 0.379
mAP50-95: 0.155
pothole mAP50: 0.630
```
