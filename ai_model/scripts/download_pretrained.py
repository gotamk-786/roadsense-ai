from pathlib import Path
import sys

project_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project_root / "training_scripts"))

from env_paths import configure_project_caches

configure_project_caches()

from ultralytics import YOLO

YOLO("yolov8n.pt")
print("model ready")
