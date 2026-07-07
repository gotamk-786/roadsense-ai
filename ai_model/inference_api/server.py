import argparse
import io
import os
import sys
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from ultralytics import YOLO

from training_scripts.env_paths import configure_project_caches


configure_project_caches()

DEFAULT_MODEL_PATH = PROJECT_ROOT / "exports" / "roadsense-rdd2022-yolov8n-best.pt"


class Detection(BaseModel):
    class_id: int
    label: str
    confidence: float
    box_xyxy: list[float]
    box_xywh: list[float]


class PredictionResponse(BaseModel):
    model: str
    image_width: int
    image_height: int
    detections: list[Detection]


def create_app(model_path: str | os.PathLike[str] = DEFAULT_MODEL_PATH, conf: float = 0.35) -> FastAPI:
    resolved_model_path = Path(model_path).resolve()
    if not resolved_model_path.exists():
        raise FileNotFoundError(f"Model not found: {resolved_model_path}")

    model = YOLO(str(resolved_model_path))

    app = FastAPI(
        title="RoadSense AI Inference API",
        version="0.1.0",
        description="Local YOLO inference API for RoadSense AI road hazard detection.",
    )
    app.state.model = model
    app.state.model_path = str(resolved_model_path)
    app.state.confidence = conf

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict[str, Any]:
        return {
            "status": "ok",
            "model": app.state.model_path,
            "confidence": app.state.confidence,
        }

    @app.post("/predict", response_model=PredictionResponse)
    async def predict(file: UploadFile = File(...)) -> PredictionResponse:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Upload an image file.")

        raw = await file.read()
        try:
            image = Image.open(io.BytesIO(raw)).convert("RGB")
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Could not read image.") from exc

        results = app.state.model.predict(image, conf=app.state.confidence, verbose=False)
        result = results[0]
        names = result.names
        detections: list[Detection] = []

        for box in result.boxes:
            class_id = int(box.cls.item())
            xyxy = [round(float(value), 2) for value in box.xyxy[0].tolist()]
            xywh = [round(float(value), 2) for value in box.xywh[0].tolist()]
            detections.append(
                Detection(
                    class_id=class_id,
                    label=str(names[class_id]),
                    confidence=round(float(box.conf.item()), 4),
                    box_xyxy=xyxy,
                    box_xywh=xywh,
                )
            )

        return PredictionResponse(
            model=app.state.model_path,
            image_width=image.width,
            image_height=image.height,
            detections=detections,
        )

    return app


app = create_app()


def main() -> None:
    import uvicorn

    parser = argparse.ArgumentParser(description="Run RoadSense AI local inference API.")
    parser.add_argument("--model", default=str(DEFAULT_MODEL_PATH), help="Path to YOLO .pt model.")
    parser.add_argument("--host", default="127.0.0.1", help="API host.")
    parser.add_argument("--port", default=8000, type=int, help="API port.")
    parser.add_argument("--conf", default=0.35, type=float, help="Detection confidence threshold.")
    args = parser.parse_args()

    default_model = Path(args.model).resolve() == DEFAULT_MODEL_PATH.resolve()
    server_app = app if default_model and args.conf == 0.35 else create_app(args.model, args.conf)
    uvicorn.run(server_app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
