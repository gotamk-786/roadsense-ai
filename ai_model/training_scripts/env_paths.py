import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def configure_project_caches() -> None:
    paths = {
        "TEMP": PROJECT_ROOT / ".tmp",
        "TMP": PROJECT_ROOT / ".tmp",
        "APPDATA": PROJECT_ROOT / ".appdata",
        "LOCALAPPDATA": PROJECT_ROOT / ".localappdata",
        "PIP_CACHE_DIR": PROJECT_ROOT / ".pip-cache",
        "TORCH_HOME": PROJECT_ROOT / ".torch-cache",
        "YOLO_CONFIG_DIR": PROJECT_ROOT / ".ultralytics",
        "ULTRALYTICS_CONFIG_DIR": PROJECT_ROOT / ".ultralytics",
        "MPLCONFIGDIR": PROJECT_ROOT / ".matplotlib",
        "PYTHONPYCACHEPREFIX": PROJECT_ROOT / ".pycache",
        "XDG_CACHE_HOME": PROJECT_ROOT / ".cache",
        "HF_HOME": PROJECT_ROOT / ".hf-cache",
    }

    for key, path in paths.items():
        path.mkdir(parents=True, exist_ok=True)
        os.environ[key] = str(path)
