# RoadSense AI - Computer Vision Road Hazard Detection App

## 1. Project Summary

RoadSense AI is a computer vision based mobile/dashcam app that will analyze live video from the camera of a moving car, bike, or rickshaw on the road and warn the driver about dangerous road conditions.

The app's main purpose is to improve driver safety. It will detect road hazards such as pothole, broken road, speed breaker, road jump, animal, pedestrian, vehicle, construction barrier, water, mud, accident object, or road blockage.

## 2. Problem Statement

In Pakistan and similar countries, roads often have potholes, broken patches, sudden speed breakers, animals, pedestrians, and unexpected obstacles. Drivers often notice these hazards too late, which creates a risk of accidents, vehicle damage, or sudden braking.

This project's goal is to build an AI assistant that scans the road live and gives the driver a timely alert.

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

The app will take a live video feed from the phone camera or dashcam and detect frame by frame:

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

After detection, the app will warn the driver:

- Voice alert: `Pothole ahead`
- Beep alert
- Vibration alert
- Red/yellow warning label on screen
- Distance estimate: `Hazard approx 10 meters ahead`

### 4.3 GPS Location Logging

When a hazard is detected:

- GPS latitude/longitude is saved
- Hazard type is saved
- Confidence score is saved
- Date/time is saved
- Optional image snapshot is saved

### 4.4 Community Hazard Map

One user's detected hazard will become useful for other users.

Example:

- User A detected a pothole
- The location was saved on the backend
- When User B arrives on the same road, the app already gives a warning: `Reported pothole ahead`

### 4.5 Road Condition Score

The road can be given a score:

- Good
- Average
- Risky
- Dangerous

The score will be based on:

- Number of potholes
- Broken road detections
- Repeated reports
- Recent hazard reports
- User feedback

## 5. MVP Scope

The first version should be simple and practical.

The MVP should include only these items:

1. Mobile camera opens
2. Live video frames are processed
3. Pothole, speed breaker, animal, pedestrian, vehicle are detected
4. Bounding box is shown on screen
5. Voice/vibration alert is given
6. GPS location is saved
7. Detection history is shown in a list

It is better to add the advanced map, admin dashboard, and community reporting later in the MVP.

## 6. Advanced Features

These can be added in a future version:

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

- Supports both Android/iOS
- Strong camera integration
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

Raw model output should not be alerted directly. Applying a filter is necessary.

Rules:

- Confidence threshold: 0.50 or above
- Alert only after the same hazard is detected for 3 frames
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

- The driver should not need to operate the app while driving
- Alerts should be voice/vibration based
- App should not distract driver
- Personal faces/license plates should be avoided or blurred
- Location data should be collected with user consent
- Clear permission screen: camera, GPS, microphone not needed unless recording audio

## 16. Development Roadmap

### Phase 1 - Research and Dataset

- Select final classes
- Find existing datasets
- Collect 500-1000 images
- Annotate using Roboflow/LabelImg
- Train baseline YOLO

### Phase 2 - Model Training

- Train YOLO nano model
- Check validation metrics
- Improve false positives
- Test TFLite export

### Phase 3 - Flutter MVP

- Camera preview screen
- TFLite model integration
- Draw bounding boxes
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

If an AI coding agent works on this project, it should follow these rules:

1. Complete the MVP first, advanced features later.
2. Keep detection classes limited initially.
3. Prioritize real-time performance.
4. Keep mobile app driver distraction low.
5. Try to run the AI model offline inside the app.
6. Check privacy rules before storing sensitive data.
7. Keep backend sync optional so the app also works offline.
8. Use multi-frame filtering to reduce false positive alerts.
9. Keep code modular: camera, detector, alert, location, storage in separate modules.
10. Always run a demo/video test after each phase.

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

Slides for the university presentation:

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

- Night detection can be difficult
- Accuracy can be lower in rain/fog
- Pothole depth estimation is hard
- Results will change based on phone camera angle
- False positives are possible
- Real-time AI will consume battery
- Speed breakers and road shadows can be confused with each other

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

The project will be considered MVP complete when:

- The app shows a live road feed from the camera
- The AI model detects at least 3 classes
- A bounding box appears on screen
- Voice/vibration warning is given
- Detection is saved along with GPS
- Detection history screen shows the results
- The app shows working results on a demo road video

## 24. Recommended First Task List

1. Finalize project title: RoadSense AI
2. Finalize classes: pothole, speed_breaker, animal, pedestrian, vehicle
3. Collect dataset
4. Annotate 300-500 images
5. Train YOLOv8n
6. Run the model on a test video
7. Create Flutter app
8. Build camera screen
9. Integrate TFLite model
10. Add alert system
11. Add GPS logging
12. Prepare final report and presentation

## 25. Free-First Resume Build Plan

The project is currently being built for a resume, LinkedIn, GitHub portfolio, and university demo. Paid/commercial items should be avoided during this phase. The goal is to build a real-world looking MVP that runs on free tools, public datasets, a local backend, and an offline-first app flow.

### 25.1 What We Are Currently Using For Free

- Mobile app: React Native + Expo
- Camera/GPS/alerts: Expo Camera, Expo Location, Expo Speech, Expo Haptics
- AI training: Python + YOLO + OpenCV
- Backend: Local Node.js + Express API
- Mobile storage: AsyncStorage
- Dataset: public/free datasets plus self-collected local road videos/images
- Map: currently GPS/history only; OpenStreetMap option later
- Hosting: currently local only

### 25.2 Where To Get The Dataset From

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

### 25.4 What To Build Right Now

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

### 25.5 What Not To Do Right Now

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

All of this will go into a future commercial phase.

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

This section records the current real project state. It overrides older future-task wording like "collect dataset" or "train YOLO" for the first baseline.

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

Current best model, retrained on Google Colab (T4 GPU):

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best.pt
```

Previous CPU baseline kept as backup:

```txt
D:\6th semester\computer vision\ai_model\exports\roadsense-rdd2022-yolov8n-best-OLD.pt
```

Training setup:

```txt
Platform: Google Colab (T4 GPU)
Epochs: 150 (early stopping enabled, patience=30)
Image size: 640
Batch size: 16
Dataset: same RDD2022 China Drone set (1345 train, 383 val, 191 test images)
Classes: same 4 (longitudinal_crack, transverse_crack, alligator_crack, pothole)
```

Test metrics:

```txt
precision: 0.673
recall: 0.665
mAP50: 0.648
mAP50-95: 0.369
```

Previous CPU baseline (10 epochs, imgsz 416, batch 4), kept for comparison:

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

Train model (current, on Colab GPU):

```bat
python training_scripts\train_yolo.py --epochs 150 --imgsz 640 --batch 16 --device 0 --patience 30
```

Previous CPU baseline command, kept for reference:

```bat
python training_scripts\train_yolo.py --epochs 10 --imgsz 416 --batch 4 --device cpu
```

Run image demo:

```bat
python training_scripts\run_video_demo.py --model exports\roadsense-rdd2022-yolov8n-best.pt --source datasets\roadsense\images\test\China_Drone_000237.jpg
```

### 27.5 Next Work

- Add more pothole and speed-breaker images from local roads.
- Add negative/background road images (no damage) to reduce false positives.
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

Export command (current, matches the imgsz=640 GPU-trained model):

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
python training_scripts\export_mobile_model.py --format onnx --imgsz 640
```

Verified export:

```txt
ai_model/exports/mobile/roadsense-rdd2022-yolov8n-best.onnx
```

Important: the mobile app's `onDeviceDetector.ts` resizes camera frames and decodes model output using an `inputSize` constant that must match this export's `imgsz`. It is currently set to `640` to match the GPU-trained model.

ONNX test result (previous CPU-baseline export, kept for reference):

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

- Android SDK was moved from C drive to `D:\Android\Sdk`.
- `adb` is available inside `D:\Android\Sdk\platform-tools` but is not on PATH.
- C drive space improved after moving SDK to D.
- `gradlew assembleDebug` reaches native Gradle compile but did not finish on this laptop within practical time.
- Gradle cache is configured to `D:\gradle_roadsense`.
- Temp build folder is configured to `D:\roadsense_tmp`.
- Android build is arm64-only for faster phone APK builds: `reactNativeArchitectures=arm64-v8a`.

Efficiency changes:

- On-device inference loop now prevents overlapping model runs.
- On-device cadence is slower than mock/API mode.
- Image compression reduced before tensor conversion.
- NMS only runs on strongest candidates.
- Voice/vibration alerts have cooldown.
- GPS lookups are throttled.

Next required machine setup:

- Add `D:\Android\Sdk\platform-tools` to PATH for `adb`.
- Continue APK build with `npm.cmd run build:android:debug`.
- If build still stalls, use a stronger machine/Android Studio build or EAS Build.
