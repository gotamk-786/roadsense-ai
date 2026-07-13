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

## roadsense-rdd2022-yolov8n (GPU retrain, v2, current)

Purpose: retrain the same model on a GPU with more epochs and a larger image size to reduce false positives and raise accuracy toward production level.

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
- ONNX export for this model uses `--imgsz 640`, and `mobile_app/src/services/onDeviceDetector.ts` was updated to match (`inputSize = 640`) so the mobile app decodes this model's output correctly.
- Further gains still need more pothole/speed-breaker images and negative (no-damage) road images to cut down remaining false positives.

Demo command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```
