# Model Evaluation

## Model

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

## Dataset

RDD2022 China Drone converted to YOLO format.

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

Training reached 6 epochs on CPU.

Final training row:

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

```txt
overall precision: 0.328
overall recall: 0.429
overall mAP50: 0.379
overall mAP50-95: 0.155
```

Class mAP50-95:

```txt
longitudinal_crack: 0.145
transverse_crack: 0.202
alligator_crack: 0.015
pothole: 0.260
```

Pothole-specific result from validation output:

```txt
pothole mAP50: 0.630
pothole mAP50-95: 0.260
```

## Overfit / Underfit Judgement

The model does not show strong overfitting yet.

Reason:

- Training losses decreased across epochs.
- Validation losses also decreased across epochs.
- There is no clear gap where training improves but validation gets worse.

The model is more likely undertrained/underfit as a first baseline.

Reason:

- Overall mAP50 is still modest at 0.379.
- Overall mAP50-95 is low at 0.155.
- mAP was still improving at the final epoch.
- CPU training stopped early at 6 epochs.
- Some classes, especially alligator_crack, are weak.

Pothole detection is the strongest part of the current model, but the test set has only 10 pothole instances, so more pothole data is needed before claiming production-level accuracy.

## Visual Result

Sample prediction:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions\China_Drone_000237.jpg
```

This sample detects two potholes with high confidence.

## Recommendation

For the next model version:

1. Train for 30-50 epochs on GPU or Colab.
2. Add more pothole and speed-breaker images from local roads.
3. Balance class counts, especially pothole and alligator_crack.
4. Validate on road-level videos, not only drone images.
5. Keep this model as `v1-baseline` for the portfolio.
