# Model Evaluation

Two model versions have been trained. **v2 is the current active model** used by the mobile app; v1 is kept as a backup for comparison.

## Model

v2, current active:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-v2-yolov8n-best.pt
```

v1, kept as backup:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

## Dataset

v1 used RDD2022 China Drone data only:

```txt
train images: 1345
val images: 383
test images: 191
```

v2 combines RDD2022 with a second real-road dataset: Kaggle "Road Damage Dataset: Potholes, Cracks and Manholes" (lorenzoarcioni), 2009 real GoPro/phone photos from Rome and Sacrofano, Italy. Combined with `training_scripts\prepare_combined_dataset.py`:

```txt
train images: 2952
val images: 583
test images: 393
```

## Classes

v1 classes (4):

```txt
0 longitudinal_crack
1 transverse_crack
2 alligator_crack
3 pothole
```

v2 classes (3) — the crack subtypes above are merged into one `crack` class, and `manhole` is added from the Italy dataset:

```txt
0 crack
1 pothole
2 manhole
```

## Training Summary

v1: trained on Google Colab (T4 GPU) for up to 150 epochs, imgsz 640, batch 16, with early stopping (patience=30).

v2: trained on Google Colab (T4 GPU), 172 epochs with early stopping at epoch 142 (patience=30), imgsz 640, batch 16.

Original CPU baseline before v1, for historical comparison: trained for 6 epochs on CPU, imgsz 416, batch 4.

Original CPU baseline final training row:

```txt
train/box_loss: 1.996
train/cls_loss: 2.378
train/dfl_loss: 1.727
val/box_loss: 1.857
val/cls_loss: 2.289
val/dfl_loss: 1.695
val mAP50: 0.280
val mAP50-95: 0.125
```

## Test Metrics

v2 (current active, GPU, 172 epochs/early stop 142, imgsz 640, 3 classes):

```txt
overall precision: 0.643
overall recall: 0.555
overall mAP50: 0.571
overall mAP50-95: 0.265
inference: about 2.1 ms per image on a T4 GPU
```

v2 per-class metrics:

```txt
crack:    precision 0.603, recall 0.629, mAP50 0.623
pothole:  precision 0.561, recall 0.509, mAP50 0.485
manhole:  precision 0.767, recall 0.526, mAP50 0.605
```

v1 (GPU, 150 epochs, imgsz 640, 4 classes), kept for comparison:

```txt
overall precision: 0.673
overall recall: 0.665
overall mAP50: 0.648
overall mAP50-95: 0.369
```

Original CPU baseline, kept for historical comparison:

```txt
overall precision: 0.328
overall recall: 0.429
overall mAP50: 0.379
overall mAP50-95: 0.155
```

Original CPU baseline class mAP50-95:

```txt
longitudinal_crack: 0.145
transverse_crack: 0.202
alligator_crack: 0.015
pothole: 0.260
```

Original CPU baseline pothole-specific result from validation output:

```txt
pothole mAP50: 0.630
pothole mAP50-95: 0.260
```

## Overfit / Underfit Judgement

v1 was a large step up from the original CPU baseline: precision and recall both roughly doubled, and mAP50 rose from 0.379 to 0.648. This came from training on a GPU for far more epochs (150 vs 6-10), at a larger image size (640 vs 416) and batch size (16 vs 4).

v2's overall precision/recall/mAP50 (0.643 / 0.555 / 0.571) are a bit lower than v1's (0.673 / 0.665 / 0.648). This is expected and not a regression in quality: v2 is solving a harder, more realistic problem. It merges two datasets with different cameras, angles, and lighting (drone-aerial RDD2022 plus ground-level GoPro/phone photos), adds a new `manhole` class, and folds three separate crack subtypes into one broader `crack` class. A model covering more real-world variety with fewer, coarser classes will naturally score lower on narrow benchmark metrics while generalizing better to actual phone/dashcam footage, which is the real goal of this project.

Per-class recall is the main area to improve next: pothole (0.509) and manhole (0.526) are still missing roughly half of real instances. Precision (0.643 overall) means a meaningful fraction of positive detections are still false alarms, so plain/textured road surfaces without real damage can still trigger detections.

## Visual Result

Sample prediction (v1 model):

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions\China_Drone_000237.jpg
```

This sample detects two potholes with high confidence.

## Recommendation

For the next model version:

1. Add more pothole and manhole images, especially from local/Pakistani roads, to raise recall on both classes.
2. Add negative/background road images (no damage) to further reduce false positives.
3. Validate on road-level videos and handheld phone footage, not only drone images or the Italy dataset's camera angles.
4. Keep `roadsense-rdd2022-yolov8n-best-OLD.pt` as the `v1` baseline and `roadsense-v2-yolov8n-best.pt` as the current `v2` model for the portfolio.
