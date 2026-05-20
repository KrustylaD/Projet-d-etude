export interface MapAlert {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | string;
  type: string;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;
}

export interface AlertsMapProps {
  alerts: MapAlert[];
  onMarkerPress?: (alert: MapAlert) => void;
}

export const severityColor = (sev: string) => {
  switch (sev) {
    case 'critical':
      return '#ef4444';
    case 'warning':
      return '#fbbf24';
    default:
      return '#60a5fa';
  }
};

export const DEFAULT_CENTER = { latitude: 43.6047, longitude: 1.4442 };

export const computeCenter = (alerts: MapAlert[]) => {
  const valid = alerts.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  );
  if (valid.length === 0) return DEFAULT_CENTER;
  const lat = valid.reduce((s, a) => s + (a.latitude as number), 0) / valid.length;
  const lng = valid.reduce((s, a) => s + (a.longitude as number), 0) / valid.length;
  return { latitude: lat, longitude: lng };
};
