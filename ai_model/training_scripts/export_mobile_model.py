import argparse
import shutil
from pathlib import Path

from env_paths import configure_project_caches

configure_project_caches()

from ultralytics import YOLO


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]

    parser = argparse.ArgumentParser(description="Export RoadSense model for mobile/on-device inference.")
    parser.add_argument(
        "--model",
        default=str(project_root / "exports" / "roadsense-rdd2022-yolov8n-best.pt"),
        help="Path to trained YOLO .pt model.",
    )
    parser.add_argument("--format", default="onnx", choices=["onnx", "tflite", "ncnn"], help="Mobile export format.")
    parser.add_argument("--imgsz", default=416, type=int, help="Export image size.")
    parser.add_argument("--half", action="store_true", help="Use FP16 where supported.")
    args = parser.parse_args()

    model_path = Path(args.model)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    exports_dir = project_root / "exports" / "mobile"
    exports_dir.mkdir(parents=True, exist_ok=True)

    model = YOLO(str(model_path))
    exported_path = Path(model.export(format=args.format, imgsz=args.imgsz, half=args.half))

    target = exports_dir / exported_path.name
    if exported_path.resolve() != target.resolve():
        if exported_path.is_dir():
            if target.exists():
                shutil.rmtree(target)
            shutil.copytree(exported_path, target)
        else:
            shutil.copy2(exported_path, target)

    print(f"Mobile export created: {target}")


if __name__ == "__main__":
    main()
