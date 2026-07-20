const env = (globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
}).process?.env ?? {};

export const USE_REAL_INFERENCE = env.EXPO_PUBLIC_USE_REAL_INFERENCE === 'true';
export const USE_ON_DEVICE_INFERENCE = env.EXPO_PUBLIC_USE_ON_DEVICE_INFERENCE === 'true';
export const INFERENCE_API_URL = env.EXPO_PUBLIC_INFERENCE_API_URL ?? 'http://127.0.0.1:8000/predict';
export const BACKEND_API_URL = env.EXPO_PUBLIC_BACKEND_API_URL ?? 'http://127.0.0.1:4000/api/hazards';
