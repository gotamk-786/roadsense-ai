export type HazardType =
  | 'pothole'
  | 'speed_breaker'
  | 'animal'
  | 'pedestrian'
  | 'vehicle'
  | 'broken_road'
  | 'barrier'
  | 'water';

export type Detection = {
  id: string;
  type: HazardType;
  confidence: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  createdAt: string;
};

export type HazardReport = {
  id: string;
  type: HazardType;
  confidence: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};
