import { Detection, HazardType } from '../types/detection';

const hazardTypes: HazardType[] = ['crack', 'pothole', 'manhole'];

export async function runMockDetection(): Promise<Detection[]> {
  const shouldDetect = Math.random() > 0.62;

  if (!shouldDetect) {
    return [];
  }

  const type = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];

  return [
    {
      id: `${Date.now()}-${type}`,
      type,
      confidence: Number((0.58 + Math.random() * 0.35).toFixed(2)),
      box: {
        x: 0.18 + Math.random() * 0.24,
        y: 0.42 + Math.random() * 0.18,
        width: 0.22 + Math.random() * 0.18,
        height: 0.12 + Math.random() * 0.14
      },
      createdAt: new Date().toISOString()
    }
  ];
}
