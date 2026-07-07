import argparse
from pathlib import Path

import requests


def main() -> None:
    parser = argparse.ArgumentParser(description="Send one image to the RoadSense AI inference API.")
    parser.add_argument("--image", required=True, help="Path to image.")
    parser.add_argument("--url", default="http://127.0.0.1:8000/predict", help="Prediction endpoint.")
    args = parser.parse_args()

    image_path = Path(args.image)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with image_path.open("rb") as file:
        response = requests.post(args.url, files={"file": (image_path.name, file, "image/jpeg")}, timeout=60)

    response.raise_for_status()
    print(response.json())


if __name__ == "__main__":
    main()
