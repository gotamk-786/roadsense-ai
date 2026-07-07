import argparse

from env_paths import configure_project_caches

configure_project_caches()

from ultralytics import YOLO


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="exports/roadsense-rdd2022-yolov8n-best.pt")
    parser.add_argument("--source", required=True, help="Path to test video, image, folder, or camera index")
    parser.add_argument("--conf", default=0.35, type=float, help="Detection confidence threshold")
    parser.add_argument("--show", action="store_true", help="Open preview window")
    parser.add_argument("--save", action="store_true", help="Save annotated predictions")
    parser.add_argument("--project", default="runs", help="Output folder")
    parser.add_argument("--name", default="roadsense-demo", help="Run name")
    args = parser.parse_args()

    model = YOLO(args.model)
    model.predict(
        source=args.source,
        show=args.show,
        save=args.save,
        conf=args.conf,
        project=args.project,
        name=args.name,
    )


if __name__ == "__main__":
    main()
