# 12 - Demo Checklist

Use this checklist before recording the LinkedIn/GitHub demo video.

## 1. Start Inference API

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python inference_api\server.py --host 127.0.0.1 --port 8000 --conf 0.35
```

Open health endpoint:

```txt
http://127.0.0.1:8000/health
```

Expected:

```txt
status: ok
```

## 2. Test Model Prediction

In a second terminal:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python inference_api\test_client.py --image datasets\roadsense\images\test\China_Drone_000237.jpg
```

Expected:

```txt
pothole detections with confidence scores
```

## 3. Run Mobile App

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd run start
```

Use Expo Go to open the app.

## 4. Record Demo Video

Recommended recording order:

1. Show GitHub repo README.
2. Show `/health` endpoint.
3. Run sample image prediction.
4. Open mobile app camera screen.
5. Show detection history screen.
6. End with project architecture docs.

## 5. LinkedIn Caption

```txt
RoadSense AI - Real-time road hazard detection app.

Built a computer vision MVP that detects potholes and road damage using YOLO, serves predictions through a FastAPI inference API, and connects with a React Native mobile app for driver alerts and hazard history.

Tech stack: React Native, Expo, Python, Ultralytics YOLO, FastAPI, Node.js, TypeScript.
```
