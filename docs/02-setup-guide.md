# 02 - Setup Guide

## Prerequisites

Install these first:

- Node.js
- Python 3.10 or newer
- Git
- Expo Go app on mobile phone
- VS Code

Important on Windows PowerShell:

Use `npm.cmd`, not `npm`, if PowerShell blocks scripts.

## Mobile App Setup

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd install
npm.cmd run start
```

Then scan the Expo QR code using Expo Go.

## AI Model Setup

Use D-drive-only install script. Do not install AI dependencies globally on C drive.

```bat
cd "D:\6th semester\computer vision\ai_model"
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\install_deps_d_drive.ps1
```

Verify:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\verify_env.ps1
```

Activate when working manually:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\activate_d_drive_env.ps1
```

Test with pretrained YOLO webcam demo:

```bat
python training_scripts\run_video_demo.py --model yolov8n.pt --source 0
```

Test with video file:

```bat
python training_scripts\run_video_demo.py --model yolov8n.pt --source "D:\path\to\road_video.mp4"
```

## Backend Setup

```bat
cd "D:\6th semester\computer vision\backend"
npm.cmd install
npm.cmd run dev
```

Health check:

```txt
http://localhost:4000/health
```

## Known Windows Fixes

If npm says `expo is not recognized`:

```bat
cd "D:\6th semester\computer vision\mobile_app"
npm.cmd install
npm.cmd run start
```

If C drive is full, keep npm cache on D drive using `mobile_app/.npmrc`.

