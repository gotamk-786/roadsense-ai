# RoadSense AI

Free-first computer vision mobile app for real-time road hazard detection.

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

## Run Mobile App

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd run start
```

## Run AI Demo

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test --save
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
