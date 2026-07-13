# Model Evaluation

## Model

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

Previous CPU baseline, kept as backup for comparison:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

## Dataset

RDD2022 China Drone converted to YOLO format. Same dataset used for both the CPU baseline and the GPU retrain below.

```txt
train images: 1345
val images: 383
test images: 191
```

## Classes

```txt
0 longitudinal_crack
1 transverse_crack
2 alligator_crack
3 pothole
```

## Training Summary

Current model: trained on Google Colab (T4 GPU) for up to 150 epochs, imgsz 640, batch 16, with early stopping (patience=30).

Previous baseline, for comparison: trained for 6 epochs on CPU, imgsz 416, batch 4.

Previous baseline final training row:

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

Current model (GPU, 150 epochs, imgsz 640):

```txt
overall precision: 0.673
overall recall: 0.665
overall mAP50: 0.648
overall mAP50-95: 0.369
```

Previous CPU baseline, kept for comparison:

```txt
overall precision: 0.328
overall recall: 0.429
overall mAP50: 0.379
overall mAP50-95: 0.155
```

Previous baseline class mAP50-95:

```txt
longitudinal_crack: 0.145
transverse_crack: 0.202
alligator_crack: 0.015
pothole: 0.260
```

Previous baseline pothole-specific result from validation output:

```txt
pothole mAP50: 0.630
pothole mAP50-95: 0.260
```

Per-class mAP50-95 breakdown was not captured for the GPU retrain; only the overall metrics above are available for it so far.

## Overfit / Underfit Judgement

The current GPU model is a large step up from the CPU baseline: precision and recall both roughly doubled, and mAP50 rose from 0.379 to 0.648. This is mainly the result of training on a GPU for far more epochs (150 vs 6-10), at a larger image size (640 vs 416) and batch size (16 vs 4), which let the model converge properly instead of stopping early on CPU.

The model is not yet at a level where false positives are fully solved. Precision of 0.673 means roughly one in three positive detections is still likely a false alarm, so plain/textured surfaces without real damage can still trigger detections. Further improvement needs more data, especially negative (no-damage) road images, rather than more epochs alone.

## Visual Result

Sample prediction:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions\China_Drone_000237.jpg
```

This sample detects two potholes with high confidence.

## Recommendation

For the next model version:

1. Add more pothole and speed-breaker images from local roads.
2. Add negative/background road images (no damage) to reduce false positives.
3. Balance class counts, especially pothole and alligator_crack.
4. Validate on road-level videos and handheld phone footage, not only drone images.
5. Keep the CPU-trained model as `v1-baseline` and the current GPU model as `v2-gpu` for the portfolio.
