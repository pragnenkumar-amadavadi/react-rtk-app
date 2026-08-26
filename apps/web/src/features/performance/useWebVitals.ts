import { useEffect, useState } from 'react';
import type { Metric } from 'web-vitals';

export type VitalsState = Partial<Record<Metric['name'], { value: number; rating: Metric['rating'] }>>;

export function useWebVitals(): VitalsState {
  const [vitals, setVitals] = useState<VitalsState>({});

  useEffect(() => {
    let cancelled = false;

    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      if (cancelled) return;

      const record = (metric: Metric) => {
        setVitals((prev) => ({ ...prev, [metric.name]: { value: metric.value, rating: metric.rating } }));
      };

      onCLS(record);
      onFCP(record);
      onINP(record);
      onLCP(record);
      onTTFB(record);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return vitals;
}
