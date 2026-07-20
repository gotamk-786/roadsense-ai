import argparse
from pathlib import Path

from env_paths import configure_project_caches

configure_project_caches()

from ultralytics import YOLO, settings


def existing_file(path: Path, label: str) -> Path:
    if not path.exists():
        raise FileNotFoundError(f"{label} not found: {path}")
    return path


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]

    parser = argparse.ArgumentParser(description="Train the RoadSense AI YOLO model.")
    parser.add_argument("--model", default=str(project_root / "yolov8n.pt"), help="Base YOLO model path")
    parser.add_argument("--data", default=str(project_root / "data.yaml"), help="YOLO data.yaml path")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--imgsz", type=int, default=416)
    parser.add_argument("--batch", type=int, default=4)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--workers", type=int, default=0)
    parser.add_argument("--name", default="roadsense-rdd2022-yolov8n")
    parser.add_argument("--patience", type=int, default=5)
    parser.add_argument("--export", action="store_true", help="Export TFLite after training")
    parser.add_argument("--mosaic", type=float, default=1.0, help="Mosaic augmentation probability")
    parser.add_argument("--mixup", type=float, default=0.15, help="Mixup augmentation probability")
    parser.add_argument("--hsv-h", type=float, default=0.015, help="HSV hue augmentation")
    parser.add_argument("--hsv-s", type=float, default=0.7, help="HSV saturation augmentation")
    parser.add_argument("--hsv-v", type=float, default=0.4, help="HSV value/brightness augmentation")
    parser.add_argument("--degrees", type=float, default=10.0, help="Rotation augmentation (degrees)")
    parser.add_argument("--translate", type=float, default=0.1, help="Translation augmentation")
    parser.add_argument("--scale", type=float, default=0.5, help="Scale augmentation")
    args = parser.parse_args()

    model_path = existing_file(Path(args.model), "Base model")
    data_path = existing_file(Path(args.data), "Dataset config")

    settings.update({
        "datasets_dir": str(project_root / "datasets"),
        "runs_dir": str(project_root / "runs"),
    })

    model = YOLO(str(model_path))
    results = model.train(
        data=str(data_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        project=str(project_root / "runs"),
        name=args.name,
        device=args.device,
        workers=args.workers,
        patience=args.patience,
        mosaic=args.mosaic,
        mixup=args.mixup,
        hsv_h=args.hsv_h,
        hsv_s=args.hsv_s,
        hsv_v=args.hsv_v,
        degrees=args.degrees,
        translate=args.translate,
        scale=args.scale,
    )

    best_model = project_root / "runs" / args.name / "weights" / "best.pt"
    exports_dir = project_root / "exports"
    exports_dir.mkdir(parents=True, exist_ok=True)

    if best_model.exists():
        export_target = exports_dir / f"{args.name}-best.pt"
        export_target.write_bytes(best_model.read_bytes())
        print(f"Best model copied to: {export_target}")

    if args.export:
        model.export(format="tflite")

    print(results)


if __name__ == "__main__":
    main()
