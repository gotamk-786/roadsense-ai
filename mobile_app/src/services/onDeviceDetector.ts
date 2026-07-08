import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import { Buffer } from 'buffer';
import jpeg from 'jpeg-js';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Detection } from '../types/detection';

const inputSize = 416;
const maxCandidatesBeforeNms = 120;
const labels = ['longitudinal_crack', 'transverse_crack', 'alligator_crack', 'pothole'];
const modelAsset = require('../../assets/models/roadsense-rdd2022-yolov8n-best.onnx');

let sessionPromise: Promise<InferenceSession> | null = null;

type Candidate = {
  labelIndex: number;
  confidence: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
};

function getSession(): Promise<InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = Asset.fromModule(modelAsset)
      .downloadAsync()
      .then((asset) => InferenceSession.create(asset.localUri ?? asset.uri));
  }

  return sessionPromise;
}

export async function runOnDeviceDetection(imageUri: string): Promise<Detection[]> {
  const session = await getSession();
  const tensor = await imageToTensor(imageUri);
  const feeds: Record<string, Tensor> = {};
  feeds[session.inputNames[0]] = tensor;

  const output = await session.run(feeds);
  const result = output[session.outputNames[0]];

  return parseYoloOutput(result.data as Float32Array);
}

export async function warmOnDeviceDetector(): Promise<void> {
  await getSession();
}

async function imageToTensor(imageUri: string): Promise<Tensor> {
  const resized = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: inputSize, height: inputSize } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );

  if (!resized.base64) {
    throw new Error('Could not read image base64 data.');
  }

  const decoded = jpeg.decode(Buffer.from(resized.base64, 'base64'), { useTArray: true });
  const values = new Float32Array(1 * 3 * inputSize * inputSize);
  const channelSize = inputSize * inputSize;

  for (let y = 0; y < inputSize; y += 1) {
    for (let x = 0; x < inputSize; x += 1) {
      const pixelIndex = (y * inputSize + x) * 4;
      const tensorIndex = y * inputSize + x;
      values[tensorIndex] = decoded.data[pixelIndex] / 255;
      values[channelSize + tensorIndex] = decoded.data[pixelIndex + 1] / 255;
      values[channelSize * 2 + tensorIndex] = decoded.data[pixelIndex + 2] / 255;
    }
  }

  return new Tensor('float32', values, [1, 3, inputSize, inputSize]);
}

function parseYoloOutput(data: Float32Array): Detection[] {
  const rows = 8;
  const columns = Math.floor(data.length / rows);
  const candidates: Candidate[] = [];

  for (let index = 0; index < columns; index += 1) {
    const classScores = labels.map((_, labelIndex) => data[(4 + labelIndex) * columns + index]);
    const confidence = Math.max(...classScores);
    const labelIndex = classScores.indexOf(confidence);

    if (confidence < 0.35) {
      continue;
    }

    candidates.push({
      labelIndex,
      confidence,
      cx: data[index],
      cy: data[columns + index],
      width: data[columns * 2 + index],
      height: data[columns * 3 + index],
    });
  }

  const strongestCandidates = candidates
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxCandidatesBeforeNms);

  return nonMaxSuppression(strongestCandidates)
    .slice(0, 8)
    .map((candidate, index) => {
      const x = clamp01((candidate.cx - candidate.width / 2) / inputSize);
      const y = clamp01((candidate.cy - candidate.height / 2) / inputSize);
      const width = clamp01(candidate.width / inputSize);
      const height = clamp01(candidate.height / inputSize);
      const label = labels[candidate.labelIndex];

      return {
        id: `${Date.now()}-onnx-${index}`,
        type: label === 'pothole' ? 'pothole' : 'broken_road',
        confidence: Number(candidate.confidence.toFixed(4)),
        box: { x, y, width, height },
        createdAt: new Date().toISOString(),
      };
    });
}

function nonMaxSuppression(candidates: Candidate[]): Candidate[] {
  const selected: Candidate[] = [];
  const sorted = [...candidates].sort((a, b) => b.confidence - a.confidence);

  for (const candidate of sorted) {
    const overlaps = selected.some((item) => item.labelIndex === candidate.labelIndex && iou(item, candidate) > 0.45);
    if (!overlaps) {
      selected.push(candidate);
    }
  }

  return selected;
}

function iou(a: Candidate, b: Candidate): number {
  const aLeft = a.cx - a.width / 2;
  const aTop = a.cy - a.height / 2;
  const aRight = a.cx + a.width / 2;
  const aBottom = a.cy + a.height / 2;
  const bLeft = b.cx - b.width / 2;
  const bTop = b.cy - b.height / 2;
  const bRight = b.cx + b.width / 2;
  const bBottom = b.cy + b.height / 2;

  const interWidth = Math.max(0, Math.min(aRight, bRight) - Math.max(aLeft, bLeft));
  const interHeight = Math.max(0, Math.min(aBottom, bBottom) - Math.max(aTop, bTop));
  const intersection = interWidth * interHeight;
  const union = a.width * a.height + b.width * b.height - intersection;

  return union > 0 ? intersection / union : 0;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
