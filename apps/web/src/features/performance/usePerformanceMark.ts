import { useEffect } from 'react';

export const PERFORMANCE_MARK_PREFIX = 'app:';

export function usePerformanceMark(stage: string, id: string): void {
  useEffect(() => {
    performance.mark(`${PERFORMANCE_MARK_PREFIX}${id}:${stage}`);
  }, [stage, id]);
}
