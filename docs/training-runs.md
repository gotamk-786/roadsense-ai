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

## roadsense-rdd2022-yolov8n

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
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
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

- This is a first baseline trained on CPU.
- Pothole results are promising, but only 10 pothole instances exist in the test split.
- Better results need more pothole/speed-breaker images and longer training.

Prediction artifacts:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-test
```

Demo command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```
