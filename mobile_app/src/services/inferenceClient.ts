import { Detection, HazardType } from '../types/detection';

type ApiDetection = {
  class_id: number;
  label: string;
  confidence: number;
  box_xyxy: [number, number, number, number];
  box_xywh: [number, number, number, number];
};

type ApiPredictionResponse = {
  image_width: number;
  image_height: number;
  detections: ApiDetection[];
};

const knownHazardTypes: HazardType[] = ['crack', 'pothole', 'manhole'];

function toHazardType(label: string): HazardType {
  const match = knownHazardTypes.find((type) => type === label);
  return match ?? 'pothole';
}

export async function runApiDetection(imageUri: string, endpoint: string): Promise<Detection[]> {
  const body = new FormData();
  body.append('file', {
    uri: imageUri,
    name: 'roadsense-frame.jpg',
    type: 'image/jpeg'
  } as unknown as Blob);

  const response = await fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Inference API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiPredictionResponse;

  return payload.detections.map((item) => {
    const [x1, y1, x2, y2] = item.box_xyxy;

    return {
      id: `${Date.now()}-${item.class_id}-${Math.round(item.confidence * 10000)}`,
      type: toHazardType(item.label),
      confidence: item.confidence,
      box: {
        x: x1 / payload.image_width,
        y: y1 / payload.image_height,
        width: (x2 - x1) / payload.image_width,
        height: (y2 - y1) / payload.image_height
      },
      createdAt: new Date().toISOString()
    };
  });
}
