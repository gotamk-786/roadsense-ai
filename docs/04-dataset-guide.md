# 04 - Dataset Guide

## Goal

Create a small but useful dataset for potholes, speed breakers, broken roads, water/mud, and barriers.

## Free Dataset Sources

Primary:

- RDD2022: https://arxiv.org/abs/2209.08538

Secondary:

- Roboflow Universe: https://universe.roboflow.com
- Kaggle Datasets: https://www.kaggle.com/datasets

Search terms:

- pothole detection
- road damage detection
- speed breaker detection
- road surface defect dataset

## Self-Collected Data

Collect local road data for real-world Pakistan-style road conditions.

Rules:

- Do not use phone while driving.
- Record from passenger seat or parked vehicle.
- Avoid faces and license plates.
- Blur sensitive content before posting public demos.

## Initial Classes

```txt
0 pothole
1 speed_breaker
2 broken_road
3 water_or_mud
4 road_barrier
```

## YOLO Dataset Structure

```txt
datasets/roadsense/
  images/train
  images/val
  images/test
  labels/train
  labels/val
  labels/test
```

## Annotation Format

Each image has a `.txt` label file:

```txt
class_id x_center y_center width height
```

Coordinates are normalized from 0 to 1.

## Split Ratio

- 70% train
- 20% validation
- 10% test

## Dataset Tracking Template

```txt
Dataset name:
URL:
License:
Download date:
Classes used:
Images used:
Notes:
```

## RDD2022 Download And Prepare Workflow

The project includes a resumable downloader for the RDD2022 China Drone sample.

Download or resume download:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\download_rdd2022_sample.ps1
```

Prepare YOLO dataset after the zip is fully downloaded:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\prepare_rdd2022.py
```

This converts RDD damage classes into YOLO labels:

```txt
0 longitudinal_crack
1 transverse_crack
2 alligator_crack
3 pothole
```

Output path:

```txt
D:\6th semester\computer vision\ai_model\datasets\roadsense
```

This 4-class set was used for the v1 model only. The current v2 model merges this RDD2022 set with a second real-road dataset (Kaggle, GoPro/phone photos) into a combined 3-class dataset. See `docs/13-real-road-mobile-plan.md` and `training_scripts\prepare_combined_dataset.py` for the merge step, which remaps the 3 crack subtypes above into one `crack` class and adds a `manhole` class from the second dataset.

Then train:

```bat
python training_scripts\train_yolo.py
```
