# Training Runs

## baseline-coco8-smoke

Purpose: verify that the D-drive YOLO training environment works end to end.

Dataset: Ultralytics built-in `coco8.yaml`

Important: This is not the final road-hazard model. It is a pipeline smoke test using a tiny COCO sample dataset.

Command summary:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python -c "... YOLO training smoke test ..."
```

Output:

```txt
D:\6th semester\computer vision\ai_model\runs\baseline-coco8-smoke\weights\best.pt
D:\6th semester\computer vision\ai_model\runs\baseline-coco8-smoke\weights\last.pt
```

Result:

```txt
mAP50: 0.607
mAP50-95: 0.428
Device: CPU
Epochs: 1
Image size: 320
```

Next required step:

Add actual road-hazard dataset files under:

```txt
D:\6th semester\computer vision\ai_model\datasets\roadsense\images\train
D:\6th semester\computer vision\ai_model\datasets\roadsense\labels\train
D:\6th semester\computer vision\ai_model\datasets\roadsense\images\val
D:\6th semester\computer vision\ai_model\datasets\roadsense\labels\val
```

Then run custom road-hazard training with `training_scripts\train_yolo.py`.

## RDD2022 Dataset Add Attempt

A direct RDD2022 China Drone download was started from the official RoadDamageDetector dataset link, but the network was very slow.

Partial file saved:

```txt
D:\6th semester\computer vision\ai_model\datasets\raw\RDD2022_China_Drone.zip
```

Resume command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\download_rdd2022_sample.ps1
```

After completion, convert to YOLO:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\prepare_rdd2022.py
```

## roadsense-rdd2022-yolov8n (CPU baseline, v1)

Purpose: first actual RoadSense road-damage model trained on RDD2022 China Drone data.

Dataset prepared:

```txt
train: 1345 images
val: 383 images
test: 191 images
```

Classes:

```txt
0 longitudinal_crack
1 transverse_crack
2 alligator_crack
3 pothole
```

Training output:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-yolov8n\weights\best.pt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

Test split metrics:

```txt
precision: 0.328
recall: 0.429
mAP50: 0.379
mAP50-95: 0.155
pothole mAP50: 0.630
pothole mAP50-95: 0.260
```

Notes:

- This is the first baseline, trained on CPU for 10 epochs at imgsz 416.
- Pothole results were promising, but only 10 pothole instances exist in the test split.
- Kept as `-OLD.pt` backup after the GPU retrain below.

Prediction artifacts:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-test
```

Demo command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best-OLD.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```

## roadsense-rdd2022-yolov8n (GPU retrain, v1)

Purpose: retrain the same model on a GPU with more epochs and a larger image size to reduce false positives and raise accuracy toward production level. This became the v1 model once the v2 combined-dataset run below was completed.

Platform and settings:

```txt
Platform: Google Colab (T4 GPU)
Epochs: 150 (early stopping enabled, patience=30)
Image size: 640
Batch size: 16
Device: 0
```

Dataset: same RDD2022 China Drone set used for the CPU baseline (1345 train, 383 val, 191 test images), same 4 classes.

Training output:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

Test split metrics:

```txt
precision: 0.673
recall: 0.665
mAP50: 0.648
mAP50-95: 0.369
```

Notes:

- Precision and recall roughly doubled versus the CPU baseline, mainly from more epochs, a larger image size (640 vs 416), and a larger batch size (16 vs 4).
- Superseded by the v2 combined-dataset run below, which is now the current active model. This v1 file (`roadsense-rdd2022-yolov8n-best.pt`) is kept for comparison.
- Further gains needed more pothole/speed-breaker images and negative (no-damage) road images, which is what the v2 run below addresses.

Demo command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```

## roadsense-v2-yolov8n (GPU retrain on combined dataset, v2, current active)

Purpose: merge RDD2022 with a second real-road dataset and retrain, to move detection quality from drone-only images toward real handheld/dashcam footage, which is what the mobile app actually captures.

Dataset: RDD2022 China Drone + Kaggle "Road Damage Dataset: Potholes, Cracks and Manholes" (lorenzoarcioni, MIT license) — 2009 real GoPro/phone road photos from Rome and Sacrofano, Italy. Combined and remapped with `training_scripts\prepare_combined_dataset.py`.

```txt
train: 2952 images
val: 583 images
test: 393 images
```

Classes (3, merged from the v1 4-class scheme plus a new manhole class):

```txt
0 crack
1 pothole
2 manhole
```

Platform and settings:

```txt
Platform: Google Colab (T4 GPU)
Epochs: 172 (early stopping at epoch 142, patience=30)
Image size: 640
Batch size: 16
Device: 0
```

Training output:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-v2-yolov8n-best.pt
```

Test split metrics:

```txt
overall precision: 0.643
overall recall: 0.555
overall mAP50: 0.571
overall mAP50-95: 0.265
inference: about 2.1 ms per image on a T4 GPU
```

Per-class metrics:

```txt
crack:    precision 0.603, recall 0.629, mAP50 0.623
pothole:  precision 0.561, recall 0.509, mAP50 0.485
manhole:  precision 0.767, recall 0.526, mAP50 0.605
```

Notes:

- Overall precision/recall/mAP50 are a little lower than v1's, but v2 is solving a harder problem: two different camera domains (drone-aerial + ground-level GoPro/phone), a new `manhole` class, and coarser crack labeling (3 subtypes merged into 1). This trades narrow-benchmark score for real-world generalization.
- ONNX export uses `--imgsz 640` and 3 output classes. `mobile_app/src/services/onDeviceDetector.ts`, `alertEngine.ts`, `mockDetector.ts`, and `inferenceClient.ts` were all updated to the new `crack` / `pothole` / `manhole` labels.
- The mobile app's on-device confidence threshold was lowered from 0.6 to 0.4 to reduce missed detections given v2's more conservative confidence scores.
- Next step to raise quality further: more pothole/manhole images (both classes still have recall around 0.5) and more negative/background road images.

Demo command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-v2-yolov8n-best.pt --source datasets\roadsense-v2\images\test
```
