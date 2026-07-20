# RoadSense AI

Free-first computer vision mobile app for real-time road hazard detection.

## Problem

Potholes, road cracks, and open/damaged manholes cause accidents and vehicle damage, but drivers usually only find out about them by hitting them. Most roads (especially outside major cities) have no real-time hazard-warning system, and municipal road-condition data is collected manually and rarely updated. There is no free, on-device way for a driver to get an early warning and for that hazard location to be logged automatically.

## Solution

RoadSense AI runs a custom-trained YOLOv8 object detector on the phone's live camera feed to detect `crack`, `pothole`, and `manhole` hazards in real time. When a hazard is detected it:

- Warns the driver immediately with voice and vibration alerts
- Geo-tags the detection with GPS and logs it to a local hazard map/history
- Works entirely with free/local tools — no paid cloud vision API, no commercial maps subscription

The model was trained on a combined dataset (RDD2022 drone imagery + real GoPro/phone road photos) so it generalizes to the kind of handheld/dashcam footage the mobile app actually captures, not just aerial drone shots.

## Goal

Build a resume-ready MVP that detects road hazards from a mobile camera feed and warns the driver using voice, vibration, GPS logging, and detection history.

Commercial licensing, paid maps, hosted storage, and Play Store release are future work. The current version uses free/local tools.

## Project Structure

```txt
mobile_app/   React Native + Expo mobile app
ai_model/     YOLO training, dataset config, model exports
ai_model/inference_api/ Local FastAPI service for YOLO predictions
backend/      Local Express API for hazard reports
docs/         Industry-style documentation
```

## Model Status

Two trained versions exist; v2 is the current active model used by the app.

**v2 (current active):** `ai_model/exports/roadsense-v2-yolov8n-best.pt`
- Dataset: RDD2022 China Drone + Kaggle "Road Damage Dataset" (Italy) + a Kaggle Indian roads pothole dataset (pothole boxes plus hard-negative background images of unpaved/ungraded roads, speed breakers, and bumps)
- Classes: `crack`, `pothole`, `manhole`
- Training: Google Colab T4 GPU, up to 200 epochs (early stop, best at epoch 117), imgsz 640, batch 16, patience 30
- Validation metrics: precision 0.715, recall 0.59, mAP50 0.651, mAP50-95 0.322
  - crack: precision 0.68, recall 0.612, mAP50 0.64
  - pothole: precision 0.706, recall 0.601, mAP50 0.663
  - manhole: precision 0.758, recall 0.558, mAP50 0.651
- Inference: ~2.1 ms per image on a T4 GPU

**v1 (backup):** `ai_model/exports/roadsense-rdd2022-yolov8n-best-OLD.pt`
- Dataset: RDD2022 China Drone only
- Classes: `longitudinal_crack`, `transverse_crack`, `alligator_crack`, `pothole`
- Training: Google Colab T4 GPU, 150 epochs, imgsz 640, batch 16
- Test metrics: precision 0.673, recall 0.665, mAP50 0.648, mAP50-95 0.369

See `docs/model-evaluation.md` and `docs/training-runs.md` for full details.

## Free MVP Stack

- React Native + Expo
- Python + YOLO + OpenCV
- Local Node.js + Express backend
- AsyncStorage for local mobile history
- Public/free datasets plus self-collected local road data

## Documentation

Read docs in this order:

1. `docs/01-project-overview.md`
2. `docs/02-setup-guide.md`
3. `docs/03-architecture.md`
4. `docs/04-dataset-guide.md`
5. `docs/05-ai-training-guide.md`
6. `docs/06-mobile-app-guide.md`
7. `docs/07-backend-api-guide.md`
8. `docs/08-demo-and-resume-guide.md`
9. `docs/09-roadmap.md`
10. `docs/10-quality-checklist.md`
11. `docs/11-inference-api-guide.md`
12. `docs/12-demo-checklist.md`
13. `docs/13-real-road-mobile-plan.md`

## Run Mobile App

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd run start
```

## Run AI Demo

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-v2-yolov8n-best.pt --source datasets\roadsense-v2\images\test --save
```

## Run YOLO Inference API

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python inference_api\server.py --host 127.0.0.1 --port 8000 --conf 0.35
```

Test the API:

```bat
python inference_api\test_client.py --image datasets\roadsense\images\test\China_Drone_000237.jpg
```

## Run Backend

```bat
cd "D:\6th semester\computer vision\backend"
npm.cmd install
npm.cmd run dev
```

## Portfolio Positioning

```txt
RoadSense AI - Real-Time Road Hazard Detection Mobile App
Built with React Native, Expo, Python, YOLO, OpenCV, and Node.js.
```
