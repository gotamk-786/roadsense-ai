# RoadSense AI - Computer Vision Road Hazard Detection App

## 1. Project Summary

RoadSense AI aik computer vision based mobile/dashcam app hai jo road par chalti car, bike ya rickshaw ke camera se live video analyze karega aur driver ko dangerous road conditions ke bare mein warning dega.

App ka main purpose driver safety improve karna hai. Ye road ke hazards detect karega jaise pothole, broken road, speed breaker, road jump, animal, pedestrian, vehicle, construction barrier, water, mud, accident object, ya road blockage.

## 2. Problem Statement

Pakistan aur similar countries mein roads par aksar potholes, broken patches, sudden speed breakers, animals, pedestrians, aur unexpected obstacles hotay hain. Driver ko in hazards ka late pata chalta hai, jis se accident, vehicle damage, ya sudden braking ka risk hota hai.

Is project ka goal hai aik AI assistant banana jo road ko live scan kare aur driver ko time par alert de.

## 3. Target Users

- Car drivers
- Bike riders
- Delivery riders
- Public transport drivers
- Ride-hailing drivers
- Logistics companies
- City traffic departments
- Road maintenance authorities

## 4. Core Features

### 4.1 Live Camera Detection

App phone camera ya dashcam se live video feed lega aur frame by frame detect karega:

- Pothole
- Broken road
- Speed breaker
- Road jump
- Animal on road
- Pedestrian
- Vehicle
- Bicycle / bike
- Road barrier
- Traffic cone
- Construction object
- Water / mud on road
- Accident object / fallen object

### 4.2 Real-Time Alerts

Detection ke baad app driver ko warning dega:

- Voice alert: `Pothole ahead`
- Beep alert
- Vibration alert
- Screen par red/yellow warning label
- Distance estimate: `Hazard approx 10 meters ahead`

### 4.3 GPS Location Logging

Jab hazard detect ho:

- GPS latitude/longitude save ho
- Hazard type save ho
- Confidence score save ho
- Date/time save ho
- Optional image snapshot save ho

### 4.4 Community Hazard Map

Aik user ka detected hazard doosre users ke liye useful banega.

Example:

- User A ne pothole detect kiya
- Location backend par save hui
- User B jab same road par aaye, app pehle se warning de: `Reported pothole ahead`

### 4.5 Road Condition Score

Road ko score diya ja sakta hai:

- Good
- Average
- Risky
- Dangerous

Score based hoga:

- Number of potholes
- Broken road detections
- Repeated reports
- Recent hazard reports
- User feedback

## 5. MVP Scope

Pehla version simple aur practical hona chahiye.

MVP mein sirf ye cheezen hon:

1. Mobile camera open ho
2. Live video frames process hon
3. Pothole, speed breaker, animal, pedestrian, vehicle detect hon
4. Bounding box screen par show ho
5. Voice/vibration alert aaye
6. GPS location save ho
7. Detection history list mein show ho

MVP mein advanced map, admin dashboard, aur community reporting baad mein add karna better hai.

## 6. Advanced Features

Future version mein add kar sakte hain:

- Offline AI model
- Google Maps / Mapbox integration
- Dangerous area heatmap
- Lane detection
- Collision warning
- Night mode detection
- Rain/fog mode
- Auto report to municipal authority
- Driver safety score
- Trip recording
- Fleet dashboard
- Admin verification panel
- User confirmation: `Is this pothole still present?`
- Duplicate hazard merging
- Emergency braking detection using accelerometer

## 7. Recommended Tech Stack

### 7.1 Mobile App

Recommended: Flutter

Reasons:

- Android/iOS dono support
- Camera integration strong
- TensorFlow Lite support available
- GPS, vibration, TTS easily available
- Fast UI development

Alternative:

- React Native
- Native Android Kotlin

### 7.2 Computer Vision Model

Recommended options:

- YOLOv8 Nano / Small
- YOLOv11 Nano / Small
- TensorFlow Lite object detection model
- OpenCV for preprocessing

Best MVP choice:

- Train YOLO model in Python
- Export to TFLite
- Run model inside Flutter app

### 7.3 Backend

Simple MVP backend:

- Firebase Firestore
- Firebase Storage
- Firebase Auth

More scalable backend:

- Node.js + Express
- PostgreSQL + PostGIS
- Cloud storage for images

### 7.4 Maps

- Google Maps API
- Mapbox
- OpenStreetMap

### 7.5 AI Training

- Python
- Ultralytics YOLO
- OpenCV
- Roboflow for dataset labeling/export
- Google Colab for training

## 8. Dataset Plan

### 8.1 Classes

Initial model classes:

1. pothole
2. speed_breaker
3. broken_road
4. animal
5. pedestrian
6. vehicle
7. barrier
8. water

For MVP, keep classes small:

1. pothole
2. speed_breaker
3. animal
4. pedestrian
5. vehicle

### 8.2 Data Sources

Possible sources:

- Self-recorded road videos
- Public pothole datasets
- Roboflow Universe datasets
- Kaggle road damage datasets
- YouTube road videos converted to frames, only if license allows
- Manually captured mobile camera images

### 8.3 Data Collection Rules

- Record in day, night, rain, dusty roads
- Include different camera angles
- Include bike and car perspective
- Capture both good and damaged roads
- Avoid personal face/license plate storage if possible
- Blur sensitive details if storing images publicly

### 8.4 Annotation

Use bounding boxes for object detection.

Annotation format:

- YOLO format preferred
- Each image has `.txt` label file
- One line per object:

```txt
class_id x_center y_center width height
```

### 8.5 Dataset Split

- 70% training
- 20% validation
- 10% testing

## 9. AI Model Pipeline

### 9.1 Training Flow

1. Collect images/videos
2. Convert videos into frames
3. Label hazards
4. Train YOLO model
5. Validate precision/recall
6. Test on unseen road videos
7. Export model to TFLite/ONNX
8. Integrate in mobile app

### 9.2 Metrics

Track:

- mAP50
- Precision
- Recall
- FPS on mobile
- False positives
- False negatives
- Detection delay

### 9.3 Minimum Quality Target

For MVP:

- 15+ FPS on mid-range Android phone
- Pothole precision above 75%
- Animal/pedestrian recall high enough for warning use
- Alert delay under 1 second

## 10. Mobile App Screens

### 10.1 Camera Detection Screen

Main screen:

- Full camera preview
- Bounding boxes
- Current hazard alert
- GPS status
- Recording/detection toggle
- Small speed indicator if GPS speed available

### 10.2 Detection History Screen

Show list:

- Hazard type
- Date/time
- Location
- Confidence
- Snapshot optional

### 10.3 Map Screen

Show:

- Pothole markers
- Dangerous road segments
- Current location
- Filter by hazard type

### 10.4 Settings Screen

Options:

- Voice alert on/off
- Vibration on/off
- Detection sensitivity
- Save image snapshots on/off
- Offline mode
- Data upload on Wi-Fi only

### 10.5 Admin Dashboard

For future web dashboard:

- View all reports
- Verify false reports
- Merge duplicate reports
- Export road damage data
- Mark hazard as fixed

## 11. App Architecture

```txt
Mobile Camera
    -> Frame Extraction
    -> AI Object Detection Model
    -> Detection Filter
    -> Alert Engine
    -> GPS Logger
    -> Local Storage
    -> Backend Sync
    -> Community Map
```

### 11.1 Detection Filter

Raw model output ko direct alert nahi karna chahiye. Filter lagana zaroori hai.

Rules:

- Confidence threshold: 0.50 or above
- Same hazard 3 frames tak detect ho phir alert
- Duplicate alerts cooldown: 5-10 seconds
- Ignore very small boxes unless nearby object suspected

### 11.2 Alert Engine

Severity levels:

- Low: vehicle far away, weak confidence
- Medium: pothole/speed breaker ahead
- High: pedestrian/animal/obstacle close

Example:

```txt
IF class = animal AND confidence > 0.65 THEN voice alert = "Animal ahead"
IF class = pothole AND confidence > 0.55 for 3 frames THEN voice alert = "Pothole ahead"
```

## 12. Database Design

### 12.1 hazards Table / Collection

Fields:

```txt
id
user_id
hazard_type
latitude
longitude
confidence
image_url
created_at
last_seen_at
status
report_count
verified_count
```

### 12.2 users Table / Collection

Fields:

```txt
id
name
email
role
created_at
```

### 12.3 trips Table / Collection

Fields:

```txt
id
user_id
start_time
end_time
start_latitude
start_longitude
end_latitude
end_longitude
hazard_count
road_score
```

## 13. API Design

### 13.1 Create Hazard Report

```http
POST /api/hazards
```

Request:

```json
{
  "hazard_type": "pothole",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "confidence": 0.82,
  "image_url": "optional"
}
```

### 13.2 Get Nearby Hazards

```http
GET /api/hazards/nearby?lat=24.8607&lng=67.0011&radius=500
```

### 13.3 Update Hazard Status

```http
PATCH /api/hazards/:id
```

Request:

```json
{
  "status": "fixed"
}
```

## 14. Local App Data

Use local database/cache:

- SQLite
- Hive
- SharedPreferences for settings

Store:

- User settings
- Last detections
- Unsynced hazard reports
- Offline map cache optional

## 15. Privacy and Safety

Important rules:

- Driver ko app operate karne ki zaroorat na ho while driving
- Alerts voice/vibration based hon
- App should not distract driver
- Personal faces/license plates avoid ya blur hon
- Location data user consent ke sath collect ho
- Clear permission screen: camera, GPS, microphone not needed unless recording audio

## 16. Development Roadmap

### Phase 1 - Research and Dataset

- Final classes select karo
- Existing datasets find karo
- 500-1000 images collect karo
- Roboflow/LabelImg se annotate karo
- Baseline YOLO train karo

### Phase 2 - Model Training

- YOLO nano model train karo
- Validation metrics check karo
- False positives improve karo
- TFLite export test karo

### Phase 3 - Flutter MVP

- Camera preview screen
- TFLite model integration
- Bounding boxes draw karo
- Voice/vibration alerts
- GPS permission and location logging
- Detection history

### Phase 4 - Backend and Map

- Firebase/Node backend
- Hazard upload API
- Nearby hazard API
- Map markers
- Duplicate detection merge logic

### Phase 5 - Testing

- Test on bike/car videos
- Test day/night
- Test speed variations
- Test false alerts
- Battery and FPS optimization

### Phase 6 - Final Presentation

- Demo video
- Architecture diagram
- Dataset summary
- Model metrics
- App screenshots
- Limitations and future work

## 17. Folder Structure

Recommended structure:

```txt
road-sense-ai/
  mobile_app/
    lib/
    assets/models/
    assets/labels/
  ai_model/
    datasets/
    notebooks/
    training_scripts/
    exports/
  backend/
    src/
    prisma_or_models/
  dashboard/
    src/
  docs/
    architecture.md
    dataset.md
    api.md
    testing.md
```

## 18. Agent Instructions

Agar koi AI coding agent is project par kaam kare, to ye rules follow kare:

1. Pehle MVP complete kare, advanced features baad mein.
2. Detection classes initially limited rakhe.
3. Real-time performance ko priority de.
4. Mobile app driver distraction kam rakhe.
5. AI model ko app ke andar offline chalane ki koshish kare.
6. Sensitive data store karne se pehle privacy rules check kare.
7. Backend sync optional rakhe so app offline bhi work kare.
8. False positive alerts reduce karne ke liye multi-frame filtering use kare.
9. Code modular ho: camera, detector, alert, location, storage separate modules mein.
10. Har phase ke baad demo/video test zaroor kare.

## 19. Suggested Project Names

- RoadSense AI
- SafeRide Vision
- RoadEye
- DriveGuard AI
- Smart Road Alert
- PathGuard
- VisionDrive

Recommended final name: RoadSense AI

## 20. Presentation Outline

University presentation ke liye slides:

1. Title: RoadSense AI
2. Problem statement
3. Motivation
4. Proposed solution
5. System architecture
6. Computer vision model
7. Dataset and annotation
8. Mobile app workflow
9. Backend and map system
10. Results and screenshots
11. Limitations
12. Future work
13. Conclusion

## 21. Limitations

- Night detection difficult ho sakti hai
- Rain/fog mein accuracy kam ho sakti hai
- Pothole depth estimate hard hai
- Phone camera angle se result change hoga
- False positives possible hain
- Real-time AI battery consume karega
- Speed breaker aur road shadow confuse ho sakte hain

## 22. Future Improvements

- Depth estimation
- Stereo camera support
- Automatic road repair reports
- Government dashboard
- Fleet company analytics
- Better low-light model
- Edge AI optimization
- Crowdsourced verified hazard database

## 23. Final MVP Definition

Project tab MVP complete mana jayega jab:

- App camera se live road feed dikhaye
- AI model at least 3 classes detect kare
- Screen par bounding box aaye
- Voice/vibration warning aaye
- GPS ke sath detection save ho
- Detection history screen par result show ho
- Demo road video par app working show ho

## 24. Recommended First Task List

1. Project title final karo: RoadSense AI
2. Classes final karo: pothole, speed_breaker, animal, pedestrian, vehicle
3. Dataset collect karo
4. 300-500 images annotate karo
5. YOLOv8n train karo
6. Test video par model run karo
7. Flutter app create karo
8. Camera screen banao
9. TFLite model integrate karo
10. Alert system add karo
11. GPS logging add karo
12. Final report and presentation banao

## 25. Free-First Resume Build Plan

Project abhi resume, LinkedIn, GitHub portfolio, aur university demo ke liye ban raha hai. Is phase mein paid/commercial cheezon ko avoid karna hai. Goal aik real-world looking MVP banana hai jo free tools, public datasets, local backend, aur offline-first app flow par chale.

### 25.1 Abhi Free Mein Kya Use Kar Rahe Hain

- Mobile app: React Native + Expo
- Camera/GPS/alerts: Expo Camera, Expo Location, Expo Speech, Expo Haptics
- AI training: Python + YOLO + OpenCV
- Backend: Local Node.js + Express API
- Mobile storage: AsyncStorage
- Dataset: public/free datasets plus self-collected local road videos/images
- Map: abhi GPS/history only; OpenStreetMap option later
- Hosting: abhi local only

### 25.2 Dataset Kahan Se Uthana Hai

Primary dataset:

- RDD2022 paper/source: https://arxiv.org/abs/2209.08538
- Use for pothole, road damage, broken/cracked road examples

Secondary sources:

- Roboflow Universe: https://universe.roboflow.com
- Kaggle Datasets: https://www.kaggle.com/datasets

Search terms:

- pothole detection
- road damage detection
- speed breaker detection
- road surface defect dataset

Self-collected data:

- Local road videos/images for Pakistan-style potholes, speed breakers, water/mud, and broken roads
- Record safely; do not operate phone while driving
- Avoid faces and license plates where possible

Dataset tracking file:

- `docs/dataset-sources.md`

### 25.3 Classes Strategy

Custom train these classes first:

1. pothole
2. speed_breaker
3. broken_road
4. water_or_mud
5. road_barrier

Use pretrained YOLO/COCO classes for common objects:

1. person/pedestrian
2. car
3. motorcycle
4. bus
5. truck
6. bicycle
7. common animals where available

This keeps dataset work manageable and makes the MVP faster to finish.

### 25.4 Abhi Kya Build Karna Hai

1. Mobile camera screen
2. Mock detection demo first
3. Bounding boxes on camera
4. Voice and vibration alerts
5. GPS detection history
6. Local Express backend API
7. Dataset documentation
8. YOLO training script
9. Video demo using `run_video_demo.py`
10. Short demo recording for LinkedIn/GitHub

### 25.5 Abhi Kya Nahi Karna

Do not spend time now on:

- Google Maps paid API
- Firebase paid/cloud production setup
- Paid cloud storage
- Paid Roboflow training plan
- Play Store release
- Commercial licensing
- User accounts/authentication
- Real municipal reporting
- Fleet dashboard
- Production cloud deployment

Ye sab future commercial phase mein jayega.

### 25.6 Free Backend Plan

Current backend:

- Express API
- In-memory hazard storage
- Nearby hazard endpoint
- Update hazard status endpoint

Next free upgrade:

- SQLite local database
- Local JSON export
- Optional local PostgreSQL

### 25.7 Free Map Plan

Phase 1:

- Show GPS coordinates in detection history
- No paid map API

Phase 2:

- Add OpenStreetMap using a free/open approach if needed
- Keep map optional until AI detection demo is strong

### 25.8 Resume/LinkedIn Positioning

Project title:

```txt
RoadSense AI - Real-Time Road Hazard Detection Mobile App
```

Resume line:

```txt
Built a React Native computer vision mobile app that detects road hazards from live camera feed and provides driver alerts using voice, vibration, GPS logging, and a YOLO-based training pipeline.
```

LinkedIn focus:

- unsafe roads problem
- AI camera-based road hazard warning
- React Native, Expo, Python, YOLO, OpenCV, Node.js
- live camera UI, alerts, GPS history, model demo

### 25.9 Commercial Phase Later

Later, after MVP/demo is strong, check:

- YOLO/computer vision model license for commercial use
- Google Maps or Mapbox pricing
- Firebase/backend hosting cost
- Play Store release requirements
- Privacy policy and GPS consent
- Production database and security

Commercial checks are future work, not required for the free resume MVP.

## 26. Documentation Workflow

Industry-style documentation has been added under `docs/`.

Read order:

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

Future contributors/agents must update the matching doc whenever they change setup, architecture, dataset, training, mobile app, backend API, or roadmap behavior.

## 27. Actual Dataset And Training Status

This section records the current real project state. It overrides older future-task wording like "dataset collect karo" or "YOLO train karo" for the first baseline.

### 27.1 Dataset Download Completed

Downloaded dataset zip:

```txt
D:\6th semester\computer vision\ai_model\datasets\raw\RDD2022_China_Drone.zip
```

Size:

```txt
160,193,541 bytes
```

Source:

```txt
RDD2022 China Drone data from the Road Damage Detection Challenge dataset links.
```

### 27.2 Dataset Converted To YOLO

Prepared YOLO dataset:

```txt
D:\6th semester\computer vision\ai_model\datasets\roadsense
```

Counts:

```txt
images/train: 1345
images/val: 383
images/test: 191
labels/train: 1345
labels/val: 383
labels/test: 191
```

Classes in `ai_model/data.yaml`:

```txt
0 longitudinal_crack
1 transverse_crack
2 alligator_crack
3 pothole
```

### 27.3 Model Training Completed

First real baseline model:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

Original training output:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-yolov8n\weights\best.pt
```

Test metrics:

```txt
precision: 0.328
recall: 0.429
mAP50: 0.379
mAP50-95: 0.155
pothole mAP50: 0.630
pothole mAP50-95: 0.260
```

Prediction artifacts:

```txt
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-predictions
D:\6th semester\computer vision\ai_model\runs\roadsense-rdd2022-test
```

### 27.4 Commands To Reproduce

Activate D-drive environment:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
```

Prepare dataset after zip download:

```bat
python training_scripts\prepare_rdd2022.py
```

Train model:

```bat
python training_scripts\train_yolo.py --epochs 10 --imgsz 416 --batch 4 --device cpu
```

Run image demo:

```bat
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```

### 27.5 Next Work

- Add more pothole and speed-breaker images from local roads.
- Train longer on a GPU or Google Colab for better metrics.
- Integrate `exports\roadsense-rdd2022-yolov8n-best.pt` into the mobile app or convert it to a mobile-friendly format.
- Keep all AI environment/cache/model files on D drive.

## 28. Inference API And Mobile Integration Status

Added local FastAPI inference service:

```txt
ai_model/inference_api/server.py
ai_model/inference_api/test_client.py
```

Purpose:

- Load trained YOLO model from `ai_model/exports/roadsense-rdd2022-yolov8n-best.pt`
- Expose `/health`
- Expose `/predict` for multipart image upload
- Return JSON detections with class label, confidence, and bounding boxes

Verified sample API result:

```txt
Image: datasets/roadsense/images/test/China_Drone_000237.jpg
Detections:
- pothole 0.9905
- pothole 0.9035
```

Mobile app integration added:

```txt
mobile_app/src/services/inferenceClient.ts
mobile_app/src/config/inference.ts
```

Current mobile default:

```txt
USE_REAL_INFERENCE = false
```

Reason:

- Mock mode keeps Expo app runnable without PC API setup.
- Real mode can be enabled for demo by setting `USE_REAL_INFERENCE = true`.
- On a physical phone, `INFERENCE_API_URL` must use laptop/PC LAN IP instead of `127.0.0.1`.

Documentation added:

```txt
docs/11-inference-api-guide.md
```

Next industry-level step:

- Record a short demo video showing API response plus mobile camera overlay.
- Train longer on GPU/Colab for stronger mAP.
- Add database persistence for hazard reports.
- Later export model to ONNX/TFLite for on-device mobile inference.

## 29. Backend Persistence Improvement

Backend hazard reports now persist locally instead of living only in memory.

Changed files:

```txt
backend/src/services/hazardStore.ts
backend/src/routes/hazards.ts
docs/07-backend-api-guide.md
```

Runtime data file:

```txt
backend/data/hazards.json
```

Notes:

- `backend/data/` is ignored by Git because it is runtime/local data.
- Duplicate hazard reports within 25 meters still merge into one report and increase `report_count`.
- Status updates are validated with allowed values: `active`, `fixed`, `false_positive`, `archived`.
- New endpoint added: `GET /api/hazards/stats`.

Future production upgrade:

- Replace JSON file persistence with SQLite/PostgreSQL.
- Use PostGIS or a geospatial index for large-scale nearby search.

## 30. Mobile Real Inference Setup

Mobile app now reads inference settings from Expo public environment variables.

Committed example:

```txt
mobile_app/.env.example
```

Local machine config:

```txt
mobile_app/.env.local
```

Current local values:

```txt
EXPO_PUBLIC_USE_REAL_INFERENCE=true
EXPO_PUBLIC_INFERENCE_API_URL=http://192.168.100.9:8000/predict
```

Verified on laptop:

```txt
GET http://192.168.100.9:8000/health -> status ok
POST http://192.168.100.9:8000/predict -> pothole detections returned
```

Phone test requirement:

- Start inference API with `--host 0.0.0.0`.
- Start Expo app.
- Phone and laptop must be on the same Wi-Fi.
- If laptop IP changes, update `mobile_app/.env.local`.

## 31. Real Road On-Device Model Export

Road use cannot depend on the laptop FastAPI server because phone and laptop will not always share Wi-Fi.

Added mobile export script:

```txt
ai_model/training_scripts/export_mobile_model.py
```

Export command:

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\export_mobile_model.py --format onnx --imgsz 416
```

Verified export:

```txt
ai_model/exports/mobile/roadsense-rdd2022-yolov8n-best.onnx
```

ONNX test result:

```txt
Source image: datasets/roadsense/images/test/China_Drone_000237.jpg
Result: 2 potholes detected
Runtime: ONNX Runtime CPU
Inference time on laptop: about 89 ms
```

Important:

- AI workspace ONNX exports are generated artifacts and are ignored by Git.
- The mobile app copy at `mobile_app/assets/models/roadsense-rdd2022-yolov8n-best.onnx` is committed because the real-road Android build needs the model bundled in the app.
- For real road phone use, next implementation needs an Expo development build or native Android app with `onnxruntime-react-native`.
- Expo Go cannot load native ONNX/TFLite runtime modules.

## 32. Real Road Android App Work

Implemented on-device inference scaffold in the mobile app.

Added:

```txt
mobile_app/assets/models/roadsense-rdd2022-yolov8n-best.onnx
mobile_app/src/services/onDeviceDetector.ts
```

Installed mobile native dependencies:

```txt
onnxruntime-react-native
expo-dev-client
expo-asset
expo-file-system
expo-image-manipulator
jpeg-js
buffer
```

Config:

```txt
EXPO_PUBLIC_USE_ON_DEVICE_INFERENCE=true
EXPO_PUBLIC_USE_REAL_INFERENCE=false
```

Generated native Android project:

```txt
mobile_app/android/
```

Verification completed:

```txt
npm.cmd run typecheck -> pass
```

Build blocker:

- `adb` is not installed/on PATH.
- Android SDK env vars are not configured.
- `gradlew assembleDebug` started but failed/was stopped because the machine ran out of disk/pagefile resources while Gradle was building/downloading.
- Gradle cache must stay on D drive using `GRADLE_USER_HOME`.

Next required machine setup:

- Install Android Studio + SDK + Platform Tools.
- Increase available C drive/pagefile or keep all Gradle/Android caches on D.
- Build `mobile_app/android/app/build/outputs/apk/debug/app-debug.apk`.
